const db = require('../../../config/db');

class Ledger {
    // ✅ Pre-Check: Verify tables exist before operations
    static async checkTablesExist() {
        try {
            const [tables] = await db.query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME IN ('journal_vouchers', 'journal_voucher_entries', 'opening_balances', 'account_heads', 'sub_account_heads')
            `);
            
            const tableNames = tables.map(table => table.TABLE_NAME);
            const requiredTables = ['journal_vouchers', 'journal_voucher_entries', 'account_heads', 'sub_account_heads'];
            
            return requiredTables.every(table => tableNames.includes(table));
        } catch (error) {
            console.error('Error checking tables existence:', error);
            return false;
        }
    }

    // ✅ Get current fiscal year
    static async getCurrentFiscalYear() {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            
            // If month is April or later, fiscal year is current year to next year
            // Otherwise, it's previous year to current year
            if (month >= 4) {
                return `${year}-${(year + 1).toString().substr(2)}`;
            } else {
                return `${year - 1}-${year.toString().substr(2)}`;
            }
        } catch (error) {
            console.error('Error getting fiscal year:', error);
            const year = new Date().getFullYear();
            return `${year}-${(year + 1).toString().substr(2)}`;
        }
    }

    // ✅ Get all accounts for dropdown
    static async getAccountsForDropdown() {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const [accounts] = await db.query(`
                SELECT DISTINCT
                    ah.id as account_head_id,
                    ah.account_head,
                    ah.account_type,
                    sah.id as sub_account_head_id,
                    sah.sub_account_head,
                    CONCAT(ah.account_head, ' - ', sah.sub_account_head) as display_name
                FROM account_heads ah
                INNER JOIN sub_account_heads sah ON ah.id = sah.account_head_id
                WHERE ah.is_active = TRUE AND sah.is_active = TRUE
                ORDER BY ah.account_head, sah.sub_account_head
            `);

            return {
                success: true,
                data: accounts
            };
        } catch (error) {
            console.error('Error getting accounts for dropdown:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch accounts'
            };
        }
    }

    // ✅ Get opening balance from opening_balances table
    static async getOpeningBalance(accountHeadId, subAccountHeadId, fromDate) {
        try {
            // First check opening_balances table
            const [openingBalanceResult] = await db.query(`
                SELECT amount, balance_type as type
                FROM opening_balances
                WHERE account_head_id = ? AND sub_account_head_id = ? AND is_active = TRUE
                ORDER BY created_at DESC
                LIMIT 1
            `, [accountHeadId, subAccountHeadId]);

            if (openingBalanceResult.length > 0) {
                return {
                    amount: parseFloat(openingBalanceResult[0].amount),
                    type: openingBalanceResult[0].type
                };
            }

            // Fallback: Calculate from journal entries before fromDate
            const [journalBalance] = await db.query(`
                SELECT 
                    COALESCE(SUM(CASE WHEN jve.debit_account_head_id = ? AND jve.debit_account_subhead_id = ? THEN jve.amount ELSE 0 END), 0) as total_debit,
                    COALESCE(SUM(CASE WHEN jve.credit_account_head_id = ? AND jve.credit_account_subhead_id = ? THEN jve.amount ELSE 0 END), 0) as total_credit
                FROM journal_voucher_entries jve
                INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                WHERE jv.date < ? AND jv.is_active = TRUE AND jve.is_active = TRUE
            `, [accountHeadId, subAccountHeadId, accountHeadId, subAccountHeadId, fromDate]);

            if (journalBalance.length > 0) {
                const totalDebit = parseFloat(journalBalance[0].total_debit);
                const totalCredit = parseFloat(journalBalance[0].total_credit);
                const balance = totalDebit - totalCredit;

                return {
                    amount: Math.abs(balance),
                    type: balance >= 0 ? 'Debit' : 'Credit'
                };
            }

            return { amount: 0, type: 'Debit' };
        } catch (error) {
            console.error('Error getting opening balance:', error);
            return { amount: 0, type: 'Debit' };
        }
    }

    // ✅ Get ledger report with PROPER journal voucher debit/credit calculation
    static async getLedgerReport(accountHeadId, subAccountHeadId, fromDate, toDate) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            // Get opening balance
            const openingBalance = await this.getOpeningBalance(accountHeadId, subAccountHeadId, fromDate);

            // Get account information
            const [accountInfo] = await db.query(`
                SELECT ah.account_head, ah.account_type, sah.sub_account_head
                FROM account_heads ah
                INNER JOIN sub_account_heads sah ON ah.id = sah.account_head_id
                WHERE ah.id = ? AND sah.id = ? AND ah.is_active = TRUE AND sah.is_active = TRUE
            `, [accountHeadId, subAccountHeadId]);

            if (accountInfo.length === 0) {
                throw new Error('Account not found or inactive');
            }

            // Get journal voucher entries for this account within date range (DEBIT entries)
            const [debitEntries] = await db.query(`
                SELECT 
                    jv.id as voucher_id,
                    jv.date,
                    jv.voucher_no,
                    jv.payment_type,
                    jve.amount,
                    jve.remarks,
                    'Debit' as entry_type,
                    CONCAT(cah.account_head, ' - ', csah.sub_account_head) as contra_account,
                    jv.created_at
                FROM journal_voucher_entries jve
                INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                INNER JOIN account_heads cah ON jve.credit_account_head_id = cah.id
                INNER JOIN sub_account_heads csah ON jve.credit_account_subhead_id = csah.id
                WHERE jve.debit_account_head_id = ? 
                AND jve.debit_account_subhead_id = ?
                AND jv.date BETWEEN ? AND ?
                AND jv.is_active = TRUE 
                AND jve.is_active = TRUE
            `, [accountHeadId, subAccountHeadId, fromDate, toDate]);

            // Get journal voucher entries for this account within date range (CREDIT entries)
            const [creditEntries] = await db.query(`
                SELECT 
                    jv.id as voucher_id,
                    jv.date,
                    jv.voucher_no,
                    jv.payment_type,
                    jve.amount,
                    jve.remarks,
                    'Credit' as entry_type,
                    CONCAT(dah.account_head, ' - ', dsah.sub_account_head) as contra_account,
                    jv.created_at
                FROM journal_voucher_entries jve
                INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                INNER JOIN account_heads dah ON jve.debit_account_head_id = dah.id
                INNER JOIN sub_account_heads dsah ON jve.debit_account_subhead_id = dsah.id
                WHERE jve.credit_account_head_id = ? 
                AND jve.credit_account_subhead_id = ?
                AND jv.date BETWEEN ? AND ?
                AND jv.is_active = TRUE 
                AND jve.is_active = TRUE
            `, [accountHeadId, subAccountHeadId, fromDate, toDate]);

            // Combine and sort all entries by date and creation time
            const allEntries = [...debitEntries, ...creditEntries].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (dateA.getTime() === dateB.getTime()) {
                    return new Date(a.created_at) - new Date(b.created_at);
                }
                return dateA - dateB;
            });

            // ✅ CORRECT BALANCE CALCULATION LOGIC
            let runningBalance = parseFloat(openingBalance.amount);
            let balanceType = openingBalance.type;
            
            const ledgerEntries = [];

            // Add opening balance entry FIRST
            if (allEntries.length > 0 || runningBalance !== 0) {
                ledgerEntries.push({
                    id: 'opening',
                    date: fromDate,
                    description: 'Opening Balance',
                    voucher_type: 'Opening',
                    voucher_no: '',
                    reference_no: '',
                    debit: balanceType === 'Debit' ? runningBalance : 0,
                    credit: balanceType === 'Credit' ? runningBalance : 0,
                    running_balance: runningBalance,
                    balance_type: balanceType === 'Debit' ? 'Dr' : 'Cr'
                });
            }

            // ✅ PROCESS EACH TRANSACTION WITH PROPER ARITHMETIC
            for (const entry of allEntries) {
                const isDebit = entry.entry_type === 'Debit';
                const amount = parseFloat(entry.amount);
                
                // Build description
                let description = `${entry.payment_type}`;
                if (entry.contra_account) {
                    description += ` - To/From: ${entry.contra_account}`;
                }
                if (entry.remarks) {
                    description += ` (${entry.remarks})`;
                }

                // ✅ PROPER JOURNAL VOUCHER CALCULATION
                if (isDebit) {
                    // DEBIT TRANSACTION
                    if (balanceType === 'Debit') {
                        // Dr + Dr = Larger Dr
                        runningBalance = runningBalance + amount;
                    } else {
                        // Cr - Dr = ?
                        if (amount > runningBalance) {
                            runningBalance = amount - runningBalance;
                            balanceType = 'Debit';
                        } else {
                            runningBalance = runningBalance - amount;
                            // balanceType remains 'Credit'
                        }
                    }
                } else {
                    // CREDIT TRANSACTION
                    if (balanceType === 'Credit') {
                        // Cr + Cr = Larger Cr
                        runningBalance = runningBalance + amount;
                    } else {
                        // Dr - Cr = ?
                        if (amount > runningBalance) {
                            runningBalance = amount - runningBalance;
                            balanceType = 'Credit';
                        } else {
                            runningBalance = runningBalance - amount;
                            // balanceType remains 'Debit'
                        }
                    }
                }

                // Add transaction entry
                ledgerEntries.push({
                    id: `${entry.voucher_id}_${entry.entry_type}_${new Date(entry.date).getTime()}`,
                    date: entry.date,
                    description: description,
                    voucher_type: 'Journal',
                    voucher_no: entry.voucher_no,
                    reference_no: entry.voucher_id.toString(),
                    debit: isDebit ? amount : 0,
                    credit: isDebit ? 0 : amount,
                    running_balance: runningBalance,
                    balance_type: balanceType === 'Debit' ? 'Dr' : 'Cr'
                });
            }

            // Add closing balance entry LAST
            if (ledgerEntries.length > 1) {
                ledgerEntries.push({
                    id: 'closing',
                    date: '',
                    description: 'C/D.',
                    voucher_type: 'Closing',
                    voucher_no: '',
                    reference_no: '',
                    debit: balanceType === 'Credit' ? runningBalance : 0,
                    credit: balanceType === 'Debit' ? runningBalance : 0,
                    running_balance: runningBalance,
                    balance_type: balanceType === 'Debit' ? 'Dr' : 'Cr'
                });
            }

            return {
                success: true,
                data: {
                    entries: ledgerEntries,
                    opening_balance: {
                        amount: openingBalance.amount,
                        type: openingBalance.type === 'Debit' ? 'Dr' : 'Cr'
                    },
                    closing_balance: {
                        amount: runningBalance,
                        type: balanceType === 'Debit' ? 'Dr' : 'Cr'
                    },
                    account_info: {
                        account_head: accountInfo[0].account_head,
                        sub_account_head: accountInfo[0].sub_account_head,
                        account_type: accountInfo[0].account_type
                    },
                    summary: {
                        total_transactions: allEntries.length,
                        total_debit: ledgerEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0),
                        total_credit: ledgerEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0)
                    }
                }
            };
        } catch (error) {
            console.error('Error in getLedgerReport:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate ledger report'
            };
        }
    }

    // ✅ Get account summary for a date range
    static async getAccountSummary(fromDate, toDate) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const [summary] = await db.query(`
                SELECT 
                    ah.account_head,
                    sah.sub_account_head,
                    ah.account_type,
                    ah.id as account_head_id,
                    sah.id as sub_account_head_id,
                    COALESCE(debit_totals.total_debit, 0) as total_debit,
                    COALESCE(credit_totals.total_credit, 0) as total_credit,
                    COALESCE(debit_totals.total_debit, 0) - COALESCE(credit_totals.total_credit, 0) as net_balance,
                    COALESCE(debit_totals.transaction_count, 0) + COALESCE(credit_totals.transaction_count, 0) as transaction_count
                FROM account_heads ah
                INNER JOIN sub_account_heads sah ON ah.id = sah.account_head_id
                LEFT JOIN (
                    SELECT 
                        jve.debit_account_head_id,
                        jve.debit_account_subhead_id,
                        SUM(jve.amount) as total_debit,
                        COUNT(*) as transaction_count
                    FROM journal_voucher_entries jve
                    INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                    WHERE jv.date BETWEEN ? AND ? AND jv.is_active = TRUE AND jve.is_active = TRUE
                    GROUP BY jve.debit_account_head_id, jve.debit_account_subhead_id
                ) debit_totals ON ah.id = debit_totals.debit_account_head_id AND sah.id = debit_totals.debit_account_subhead_id
                LEFT JOIN (
                    SELECT 
                        jve.credit_account_head_id,
                        jve.credit_account_subhead_id,
                        SUM(jve.amount) as total_credit,
                        COUNT(*) as transaction_count
                    FROM journal_voucher_entries jve
                    INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                    WHERE jv.date BETWEEN ? AND ? AND jv.is_active = TRUE AND jve.is_active = TRUE
                    GROUP BY jve.credit_account_head_id, jve.credit_account_subhead_id
                ) credit_totals ON ah.id = credit_totals.credit_account_head_id AND sah.id = credit_totals.credit_account_subhead_id
                WHERE ah.is_active = TRUE AND sah.is_active = TRUE
                HAVING total_debit > 0 OR total_credit > 0
                ORDER BY ah.account_head, sah.sub_account_head
            `, [fromDate, toDate, fromDate, toDate]);

            return {
                success: true,
                data: summary
            };
        } catch (error) {
            console.error('Error getting account summary:', error);
            return {
                success: false,
                error: error.message || 'Failed to get account summary'
            };
        }
    }

    // ✅ Get trial balance
    static async getTrialBalance(asOfDate) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const [trialBalance] = await db.query(`
                SELECT 
                    ah.account_head,
                    ah.account_type,
                    sah.sub_account_head,
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
                    WHERE is_active = TRUE
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
            `, [asOfDate, asOfDate]);

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

    // ✅ Get account balance as of a specific date
    static async getAccountBalance(accountHeadId, subAccountHeadId, asOfDate) {
        try {
            // Get opening balance
            const openingBalance = await this.getOpeningBalance(accountHeadId, subAccountHeadId, asOfDate);

            // Get transactions up to the specified date
            const [transactions] = await db.query(`
                SELECT 
                    COALESCE(SUM(CASE WHEN jve.debit_account_head_id = ? AND jve.debit_account_subhead_id = ? THEN jve.amount ELSE 0 END), 0) as total_debit,
                    COALESCE(SUM(CASE WHEN jve.credit_account_head_id = ? AND jve.credit_account_subhead_id = ? THEN jve.amount ELSE 0 END), 0) as total_credit
                FROM journal_voucher_entries jve
                INNER JOIN journal_vouchers jv ON jve.voucher_id = jv.id
                WHERE jv.date <= ? AND jv.is_active = TRUE AND jve.is_active = TRUE
            `, [accountHeadId, subAccountHeadId, accountHeadId, subAccountHeadId, asOfDate]);

            const totalDebit = parseFloat(transactions[0].total_debit);
            const totalCredit = parseFloat(transactions[0].total_credit);

            let finalBalance = openingBalance.amount;
            let finalType = openingBalance.type;

            if (finalType === 'Debit') {
                finalBalance = finalBalance + totalDebit - totalCredit;
            } else {
                finalBalance = finalBalance + totalCredit - totalDebit;
            }

            if (finalBalance < 0) {
                finalBalance = Math.abs(finalBalance);
                finalType = finalType === 'Debit' ? 'Credit' : 'Debit';
            }

            return {
                success: true,
                data: {
                    balance: finalBalance,
                    type: finalType,
                    opening_balance: openingBalance.amount,
                    opening_type: openingBalance.type,
                    total_debit: totalDebit,
                    total_credit: totalCredit
                }
            };
        } catch (error) {
            console.error('Error getting account balance:', error);
            return {
                success: false,
                error: error.message || 'Failed to get account balance'
            };
        }
    }

    // ✅ Post journal entry to ledger (for future use if needed)
    static async postJournalEntryToLedger(voucherData, entries) {
        try {
            console.log('Journal entry posted to ledger:', {
                voucher_no: voucherData.voucher_no,
                entries_count: entries.length,
                total_amount: voucherData.total_amount
            });
            
            // This can be extended to create separate ledger entries if needed
            // For now, we read directly from journal_vouchers and journal_voucher_entries
            
            return { success: true };
        } catch (error) {
            console.error('Error posting to ledger:', error);
            return { success: false, error: error.message };
        }
    }

    // ✅ Get ledger statistics
    static async getLedgerStatistics(fromDate, toDate) {
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(DISTINCT jv.id) as total_vouchers,
                    COUNT(jve.id) as total_entries,
                    COALESCE(SUM(jve.amount), 0) as total_amount,
                    COUNT(DISTINCT jv.date) as active_days,
                    COUNT(DISTINCT CONCAT(jve.debit_account_head_id, '-', jve.debit_account_subhead_id)) +
                    COUNT(DISTINCT CONCAT(jve.credit_account_head_id, '-', jve.credit_account_subhead_id)) as accounts_involved
                FROM journal_vouchers jv
                INNER JOIN journal_voucher_entries jve ON jv.id = jve.voucher_id
                WHERE jv.date BETWEEN ? AND ? AND jv.is_active = TRUE AND jve.is_active = TRUE
            `, [fromDate, toDate]);

            return {
                success: true,
                data: stats[0] || {
                    total_vouchers: 0,
                    total_entries: 0,
                    total_amount: 0,
                    active_days: 0,
                    accounts_involved: 0
                }
            };
        } catch (error) {
            console.error('Error getting ledger statistics:', error);
            return {
                success: false,
                error: error.message || 'Failed to get ledger statistics'
            };
        }
    }
}

module.exports = Ledger;
