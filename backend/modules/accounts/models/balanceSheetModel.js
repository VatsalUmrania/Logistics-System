const db = require('../../../config/db');

class BalanceSheet {
    // ✅ Pre-Check: Verify tables exist
    static async checkTablesExist() {
        try {
            const [tables] = await db.query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME IN ('account_heads', 'sub_account_heads', 'journal_vouchers', 'journal_voucher_entries', 'opening_balances', 'account_categories')
            `);
            
            const tableNames = tables.map(table => table.TABLE_NAME);
            const requiredTables = ['account_heads', 'sub_account_heads', 'journal_vouchers', 'journal_voucher_entries'];
            
            return requiredTables.every(table => tableNames.includes(table));
        } catch (error) {
            console.error('Error checking tables existence:', error);
            return false;
        }
    }

    // ✅ Get balance sheet data for a specific date
    static async getBalanceSheet(asOfDate) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            // Get all account types for balance sheet
            const balanceSheetData = {
                assets: [],
                liabilities: [],
                equity: []
            };

            // Get Asset accounts
            const assets = await this.getAccountsByType('Asset', asOfDate);
            balanceSheetData.assets = this.groupAccountsByCategory(assets);

            // Get Liability accounts
            const liabilities = await this.getAccountsByType('Liability', asOfDate);
            balanceSheetData.liabilities = this.groupAccountsByCategory(liabilities);

            // Get Equity accounts
            const equity = await this.getAccountsByType('Equity', asOfDate);
            balanceSheetData.equity = this.groupAccountsByCategory(equity);

            // Calculate totals
            const totalAssets = this.calculateCategoryTotal(balanceSheetData.assets);
            const totalLiabilities = this.calculateCategoryTotal(balanceSheetData.liabilities);
            const totalEquity = this.calculateCategoryTotal(balanceSheetData.equity);
            const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

            return {
                success: true,
                data: {
                    ...balanceSheetData,
                    totals: {
                        assets: totalAssets,
                        liabilities: totalLiabilities,
                        equity: totalEquity,
                        liabilities_equity: totalLiabilitiesAndEquity,
                        isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01
                    },
                    asOfDate: asOfDate,
                    generatedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Error generating balance sheet:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate balance sheet'
            };
        }
    }

    // ✅ Get accounts by type with calculated balances
    static async getAccountsByType(accountType, asOfDate) {
        try {
            const [accounts] = await db.query(`
                SELECT 
                    ah.id as account_head_id,
                    ah.account_head,
                    ah.account_type,
                    sah.id as sub_account_head_id,
                    sah.sub_account_head,
                    CONCAT(ah.account_head, ' - ', sah.sub_account_head) as account_name
                FROM account_heads ah
                INNER JOIN sub_account_heads sah ON ah.id = sah.account_head_id
                WHERE ah.account_type = ? 
                AND ah.is_active = TRUE 
                AND sah.is_active = TRUE
                ORDER BY ah.account_head, sah.sub_account_head
            `, [accountType]);

            const accountsWithBalances = [];

            for (const account of accounts) {
                const balance = await this.calculateAccountBalance(
                    account.account_head_id,
                    account.sub_account_head_id,
                    asOfDate
                );

                // Include accounts with non-zero balances or significant amounts
                if (Math.abs(balance.amount) > 0.01) {
                    accountsWithBalances.push({
                        account_head_id: account.account_head_id,
                        sub_account_head_id: account.sub_account_head_id,
                        name: account.account_name,
                        account_head: account.account_head,
                        sub_account_head: account.sub_account_head,
                        amount: Math.abs(balance.amount),
                        balance_type: balance.type,
                        category: this.getCategoryForAccountType(accountType, account.account_head)
                    });
                }
            }

            return accountsWithBalances;
        } catch (error) {
            console.error('Error getting accounts by type:', error);
            return [];
        }
    }

    // ✅ Calculate account balance as of a specific date
    static async calculateAccountBalance(accountHeadId, subAccountHeadId, asOfDate) {
        try {
            // Get opening balance
            const [openingBalance] = await db.query(`
                SELECT amount, balance_type
                FROM opening_balances
                WHERE account_head_id = ? AND sub_account_head_id = ? 
                AND balance_date <= ? AND is_active = TRUE
                ORDER BY balance_date DESC
                LIMIT 1
            `, [accountHeadId, subAccountHeadId, asOfDate]);

            let runningBalance = 0;
            let balanceType = 'Debit';

            if (openingBalance.length > 0) {
                runningBalance = parseFloat(openingBalance[0].amount);
                balanceType = openingBalance[0].balance_type;
            }

            // Get all journal entries up to the specified date for debit side
            const [debitEntries] = await db.query(`
                SELECT COALESCE(SUM(jve.amount), 0) as total_debit
                FROM journal_voucher_entries jve
                INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                WHERE jve.debit_account_head_id = ? 
                AND jve.debit_account_subhead_id = ?
                AND jv.date <= ?
                AND jv.is_active = TRUE 
                AND jve.is_active = TRUE
            `, [accountHeadId, subAccountHeadId, asOfDate]);

            // Get all journal entries up to the specified date for credit side
            const [creditEntries] = await db.query(`
                SELECT COALESCE(SUM(jve.amount), 0) as total_credit
                FROM journal_voucher_entries jve
                INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                WHERE jve.credit_account_head_id = ? 
                AND jve.credit_account_subhead_id = ?
                AND jv.date <= ?
                AND jv.is_active = TRUE 
                AND jve.is_active = TRUE
            `, [accountHeadId, subAccountHeadId, asOfDate]);

            const totalDebit = parseFloat(debitEntries[0]?.total_debit || 0);
            const totalCredit = parseFloat(creditEntries[0]?.total_credit || 0);

            // Calculate final balance based on account nature
            if (balanceType === 'Debit') {
                runningBalance = runningBalance + totalDebit - totalCredit;
            } else {
                runningBalance = runningBalance + totalCredit - totalDebit;
            }

            // Determine final balance type
            if (runningBalance < 0) {
                runningBalance = Math.abs(runningBalance);
                balanceType = balanceType === 'Debit' ? 'Credit' : 'Debit';
            }

            return {
                amount: runningBalance,
                type: balanceType
            };
        } catch (error) {
            console.error('Error calculating account balance:', error);
            return { amount: 0, type: 'Debit' };
        }
    }

    // ✅ Group accounts by category
    static groupAccountsByCategory(accounts) {
        const grouped = {};
        
        accounts.forEach(account => {
            const category = account.category;
            if (!grouped[category]) {
                grouped[category] = {
                    category: category,
                    accounts: [],
                    total: 0
                };
            }
            
            grouped[category].accounts.push({
                name: account.name,
                amount: account.amount,
                balance_type: account.balance_type
            });
            
            grouped[category].total += account.amount;
        });

        return Object.values(grouped);
    }

    // ✅ Get category for account type
    static getCategoryForAccountType(accountType, accountHead) {
        const categoryMappings = {
            'Asset': {
                'Cash': 'Current Assets',
                'Bank': 'Current Assets',
                'Account Receivable': 'Current Assets',
                'Inventory': 'Current Assets',
                'Petty Cash': 'Current Assets',
                'Fixed Assets': 'Fixed Assets',
                'Equipment': 'Fixed Assets',
                'Property': 'Fixed Assets',
                'Furniture': 'Fixed Assets',
                'Computer': 'Fixed Assets',
                'Vehicle': 'Fixed Assets',
                'Investment': 'Investments',
                'Long Term Investment': 'Investments'
            },
            'Liability': {
                'Account Payable': 'Current Liabilities',
                'Accrued Expenses': 'Current Liabilities',
                'Short Term Loan': 'Current Liabilities',
                'Bank Loan': 'Long Term Liabilities',
                'Long Term Loan': 'Long Term Liabilities',
                'Mortgage': 'Long Term Liabilities'
            },
            'Equity': {
                'Capital': 'Owner\'s Equity',
                'Retained Earnings': 'Retained Earnings',
                'Owner Equity': 'Owner\'s Equity',
                'Share Capital': 'Owner\'s Equity',
                'Profit': 'Retained Earnings'
            }
        };

        // Find matching category based on account head keywords
        const typeMapping = categoryMappings[accountType] || {};
        
        for (const [keyword, category] of Object.entries(typeMapping)) {
            if (accountHead.toLowerCase().includes(keyword.toLowerCase())) {
                return category;
            }
        }

        // Default categories
        const defaults = {
            'Asset': 'Current Assets',
            'Liability': 'Current Liabilities',
            'Equity': 'Owner\'s Equity'
        };

        return defaults[accountType] || 'Other';
    }

    // ✅ Calculate total for categories
    static calculateCategoryTotal(categories) {
        return categories.reduce((total, category) => total + category.total, 0);
    }

    // ✅ Get account categories for dropdown
    static async getAccountCategories() {
        try {
            const [categories] = await db.query(`
                SELECT id, name, type, sort_order
                FROM account_categories
                WHERE is_active = TRUE
                ORDER BY type, sort_order, name
            `);

            return {
                success: true,
                data: categories
            };
        } catch (error) {
            console.error('Error getting account categories:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch account categories'
            };
        }
    }

    // ✅ Get balance sheet summary
    static async getBalanceSheetSummary(fromDate, toDate) {
        try {
            const [summary] = await db.query(`
                SELECT 
                    ah.account_type,
                    COUNT(DISTINCT CONCAT(ah.id, '-', sah.id)) as account_count,
                    COALESCE(SUM(
                        CASE 
                            WHEN ah.account_type = 'Asset' THEN 
                                COALESCE(debit_totals.total_debit, 0) - COALESCE(credit_totals.total_credit, 0)
                            WHEN ah.account_type = 'Liability' THEN 
                                COALESCE(credit_totals.total_credit, 0) - COALESCE(debit_totals.total_debit, 0)
                            WHEN ah.account_type = 'Equity' THEN 
                                COALESCE(credit_totals.total_credit, 0) - COALESCE(debit_totals.total_debit, 0)
                            ELSE 0
                        END
                    ), 0) as total_balance
                FROM account_heads ah
                INNER JOIN sub_account_heads sah ON ah.id = sah.account_head_id
                LEFT JOIN (
                    SELECT 
                        jve.debit_account_head_id,
                        jve.debit_account_subhead_id,
                        SUM(jve.amount) as total_debit
                    FROM journal_voucher_entries jve
                    INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                    WHERE jv.date BETWEEN ? AND ? AND jv.is_active = TRUE AND jve.is_active = TRUE
                    GROUP BY jve.debit_account_head_id, jve.debit_account_subhead_id
                ) debit_totals ON ah.id = debit_totals.debit_account_head_id AND sah.id = debit_totals.debit_account_subhead_id
                LEFT JOIN (
                    SELECT 
                        jve.credit_account_head_id,
                        jve.credit_account_subhead_id,
                        SUM(jve.amount) as total_credit
                    FROM journal_voucher_entries jve
                    INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                    WHERE jv.date BETWEEN ? AND ? AND jv.is_active = TRUE AND jve.is_active = TRUE
                    GROUP BY jve.credit_account_head_id, jve.credit_account_subhead_id
                ) credit_totals ON ah.id = credit_totals.credit_account_head_id AND sah.id = credit_totals.credit_account_subhead_id
                WHERE ah.is_active = TRUE AND sah.is_active = TRUE
                AND ah.account_type IN ('Asset', 'Liability', 'Equity')
                GROUP BY ah.account_type
                ORDER BY ah.account_type
            `, [fromDate, toDate, fromDate, toDate]);

            return {
                success: true,
                data: summary
            };
        } catch (error) {
            console.error('Error getting balance sheet summary:', error);
            return {
                success: false,
                error: error.message || 'Failed to get balance sheet summary'
            };
        }
    }

    // ✅ Get trial balance data
    static async getTrialBalance(asOfDate) {
        try {
            const [trialBalance] = await db.query(`
                SELECT 
                    ah.account_head,
                    ah.account_type,
                    sah.sub_account_head,
                    CONCAT(ah.account_head, ' - ', sah.sub_account_head) as account_name,
                    COALESCE(opening.opening_amount, 0) as opening_balance,
                    COALESCE(opening.opening_type, 'Debit') as opening_type,
                    COALESCE(transactions.total_debit, 0) as total_debit,
                    COALESCE(transactions.total_credit, 0) as total_credit,
                    CASE 
                        WHEN COALESCE(opening.opening_type, 'Debit') = 'Debit' 
                        THEN COALESCE(opening.opening_amount, 0) + COALESCE(transactions.total_debit, 0) - COALESCE(transactions.total_credit, 0)
                        ELSE COALESCE(transactions.total_credit, 0) - COALESCE(transactions.total_debit, 0) + COALESCE(opening.opening_amount, 0)
                    END as closing_balance,
                    CASE 
                        WHEN (CASE 
                            WHEN COALESCE(opening.opening_type, 'Debit') = 'Debit' 
                            THEN COALESCE(opening.opening_amount, 0) + COALESCE(transactions.total_debit, 0) - COALESCE(transactions.total_credit, 0)
                            ELSE COALESCE(transactions.total_credit, 0) - COALESCE(transactions.total_debit, 0) + COALESCE(opening.opening_amount, 0)
                        END) >= 0 THEN 'Dr' ELSE 'Cr'
                    END as closing_type
                FROM account_heads ah
                INNER JOIN sub_account_heads sah ON ah.id = sah.account_head_id
                LEFT JOIN (
                    SELECT 
                        account_head_id,
                        sub_account_head_id,
                        amount as opening_amount,
                        balance_type as opening_type
                    FROM opening_balances
                    WHERE balance_date <= ? AND is_active = TRUE
                    ORDER BY balance_date DESC
                ) opening ON ah.id = opening.account_head_id AND sah.id = opening.sub_account_head_id
                LEFT JOIN (
                    SELECT 
                        account_head_id,
                        sub_account_head_id,
                        SUM(total_debit) as total_debit,
                        SUM(total_credit) as total_credit
                    FROM (
                        SELECT 
                            jve.debit_account_head_id as account_head_id,
                            jve.debit_account_subhead_id as sub_account_head_id,
                            SUM(jve.amount) as total_debit,
                            0 as total_credit
                        FROM journal_voucher_entries jve
                        INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                        WHERE jv.date <= ? AND jv.is_active = TRUE AND jve.is_active = TRUE
                        GROUP BY jve.debit_account_head_id, jve.debit_account_subhead_id
                        
                        UNION ALL
                        
                        SELECT 
                            jve.credit_account_head_id as account_head_id,
                            jve.credit_account_subhead_id as sub_account_head_id,
                            0 as total_debit,
                            SUM(jve.amount) as total_credit
                        FROM journal_voucher_entries jve
                        INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                        WHERE jv.date <= ? AND jv.is_active = TRUE AND jve.is_active = TRUE
                        GROUP BY jve.credit_account_head_id, jve.credit_account_subhead_id
                    ) combined
                    GROUP BY account_head_id, sub_account_head_id
                ) transactions ON ah.id = transactions.account_head_id AND sah.id = transactions.sub_account_head_id
                WHERE ah.is_active = TRUE AND sah.is_active = TRUE
                AND (COALESCE(opening.opening_amount, 0) > 0 OR COALESCE(transactions.total_debit, 0) > 0 OR COALESCE(transactions.total_credit, 0) > 0)
                ORDER BY ah.account_type, ah.account_head, sah.sub_account_head
            `, [asOfDate, asOfDate, asOfDate]);

            return {
                success: true,
                data: trialBalance
            };
        } catch (error) {
            console.error('Error getting trial balance:', error);
            return {
                success: false,
                error: error.message || 'Failed to get trial balance'
            };
        }
    }
}

module.exports = BalanceSheet;
