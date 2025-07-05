const db = require('../../../config/db');

class CashBook {
    // ✅ Get cash accounts configuration
    static async getCashAccounts() {
        try {
            const [cashAccounts] = await db.query(`
                SELECT 
                    cbc.id,
                    cbc.cash_account_head_id,
                    cbc.cash_sub_account_id,
                    ah.account_head,
                    sah.sub_account_head,
                    cbc.is_default
                FROM cash_book_config cbc
                INNER JOIN account_heads ah ON cbc.cash_account_head_id = ah.id
                INNER JOIN sub_account_heads sah ON cbc.cash_sub_account_id = sah.id
                WHERE cbc.is_active = TRUE AND ah.is_active = TRUE AND sah.is_active = TRUE
                ORDER BY cbc.is_default DESC, ah.account_head
            `);

            return {
                success: true,
                data: cashAccounts
            };
        } catch (error) {
            console.error('Error fetching cash accounts:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch cash accounts'
            };
        }
    }

    // ✅ Get cash book transactions with detailed information
    static async getCashBookTransactions(filters = {}) {
        try {
            const {
                startDate,
                endDate,
                cashAccountId,
                transactionType,
                page = 1,
                limit = 50
            } = filters;

            let whereConditions = ['al.is_active = TRUE'];
            let queryParams = [];

            // Get cash account IDs if not specified
            if (cashAccountId) {
                whereConditions.push('al.sub_account_head_id = ?');
                queryParams.push(cashAccountId);
            } else {
                // Get all configured cash accounts
                const [cashAccounts] = await db.query(`
                    SELECT cash_sub_account_id FROM cash_book_config WHERE is_active = TRUE
                `);
                
                if (cashAccounts.length > 0) {
                    const cashAccountIds = cashAccounts.map(ca => ca.cash_sub_account_id);
                    whereConditions.push(`al.sub_account_head_id IN (${cashAccountIds.map(() => '?').join(',')})`);
                    queryParams.push(...cashAccountIds);
                }
            }

            // Date range filter
            if (startDate) {
                whereConditions.push('al.transaction_date >= ?');
                queryParams.push(startDate);
            }
            if (endDate) {
                whereConditions.push('al.transaction_date <= ?');
                queryParams.push(endDate);
            }

            // Transaction type filter
            if (transactionType === 'receipts') {
                whereConditions.push('al.credit_amount > 0');
            } else if (transactionType === 'payments') {
                whereConditions.push('al.debit_amount > 0');
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            // Get total count
            const [countResult] = await db.query(`
                SELECT COUNT(*) as total
                FROM account_ledger al
                ${whereClause}
            `, queryParams);

            // Get paginated transactions
            const offset = (page - 1) * limit;
            const [transactions] = await db.query(`
                SELECT 
                    al.id,
                    al.transaction_date,
                    al.description,
                    al.voucher_type,
                    al.voucher_no,
                    al.reference_no,
                    al.debit_amount,
                    al.credit_amount,
                    al.running_balance,
                    al.balance_type,
                    ah.account_head,
                    sah.sub_account_head,
                    
                    -- Get counter party details for journal entries
                    CASE 
                        WHEN al.voucher_type = 'Journal' AND al.debit_amount > 0 THEN
                            (SELECT GROUP_CONCAT(CONCAT(cah.account_head, ' - ', csah.sub_account_head) SEPARATOR ', ')
                             FROM journal_voucher_entries jve2
                             INNER JOIN account_heads cah ON jve2.credit_account_head_id = cah.id
                             INNER JOIN sub_account_heads csah ON jve2.credit_account_subhead_id = csah.id
                             WHERE jve2.voucher_id = al.voucher_id AND jve2.debit_account_subhead_id = al.sub_account_head_id)
                        WHEN al.voucher_type = 'Journal' AND al.credit_amount > 0 THEN
                            (SELECT GROUP_CONCAT(CONCAT(dah.account_head, ' - ', dsah.sub_account_head) SEPARATOR ', ')
                             FROM journal_voucher_entries jve2
                             INNER JOIN account_heads dah ON jve2.debit_account_head_id = dah.id
                             INNER JOIN sub_account_heads dsah ON jve2.debit_account_subhead_id = dsah.id
                             WHERE jve2.voucher_id = al.voucher_id AND jve2.credit_account_subhead_id = al.sub_account_head_id)
                        ELSE 'N/A'
                    END as counter_party,
                    
                    al.created_at
                FROM account_ledger al
                INNER JOIN account_heads ah ON al.account_head_id = ah.id
                INNER JOIN sub_account_heads sah ON al.sub_account_head_id = sah.id
                ${whereClause}
                ORDER BY al.transaction_date DESC, al.id DESC
                LIMIT ? OFFSET ?
            `, [...queryParams, limit, offset]);

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                data: {
                    transactions,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages
                    }
                }
            };
        } catch (error) {
            console.error('Error fetching cash book transactions:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch cash book transactions'
            };
        }
    }

    // ✅ Get cash book summary
    static async getCashBookSummary(filters = {}) {
        try {
            const { startDate, endDate, cashAccountId } = filters;

            let whereConditions = ['al.is_active = TRUE'];
            let queryParams = [];

            // Cash account filter
            if (cashAccountId) {
                whereConditions.push('al.sub_account_head_id = ?');
                queryParams.push(cashAccountId);
            } else {
                const [cashAccounts] = await db.query(`
                    SELECT cash_sub_account_id FROM cash_book_config WHERE is_active = TRUE
                `);
                
                if (cashAccounts.length > 0) {
                    const cashAccountIds = cashAccounts.map(ca => ca.cash_sub_account_id);
                    whereConditions.push(`al.sub_account_head_id IN (${cashAccountIds.map(() => '?').join(',')})`);
                    queryParams.push(...cashAccountIds);
                }
            }

            // Date range filter
            if (startDate) {
                whereConditions.push('al.transaction_date >= ?');
                queryParams.push(startDate);
            }
            if (endDate) {
                whereConditions.push('al.transaction_date <= ?');
                queryParams.push(endDate);
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            // Get summary data
            const [summaryResult] = await db.query(`
                SELECT 
                    COALESCE(SUM(al.debit_amount), 0) as total_payments,
                    COALESCE(SUM(al.credit_amount), 0) as total_receipts,
                    COUNT(*) as total_transactions,
                    COUNT(CASE WHEN al.debit_amount > 0 THEN 1 END) as payment_count,
                    COUNT(CASE WHEN al.credit_amount > 0 THEN 1 END) as receipt_count
                FROM account_ledger al
                ${whereClause}
            `, queryParams);

            // Get opening balance
            let openingBalance = 0;
            if (startDate && cashAccountId) {
                const [openingResult] = await db.query(`
                    SELECT running_balance
                    FROM account_ledger
                    WHERE sub_account_head_id = ? 
                    AND transaction_date < ?
                    AND is_active = TRUE
                    ORDER BY transaction_date DESC, id DESC
                    LIMIT 1
                `, [cashAccountId, startDate]);

                if (openingResult.length > 0) {
                    openingBalance = openingResult[0].running_balance;
                }
            }

            // Get closing balance
            let closingBalance = 0;
            if (cashAccountId) {
                const closingWhereConditions = ['al.sub_account_head_id = ?', 'al.is_active = TRUE'];
                const closingParams = [cashAccountId];

                if (endDate) {
                    closingWhereConditions.push('al.transaction_date <= ?');
                    closingParams.push(endDate);
                }

                const [closingResult] = await db.query(`
                    SELECT running_balance
                    FROM account_ledger al
                    WHERE ${closingWhereConditions.join(' AND ')}
                    ORDER BY transaction_date DESC, id DESC
                    LIMIT 1
                `, closingParams);

                if (closingResult.length > 0) {
                    closingBalance = closingResult[0].running_balance;
                }
            }

            const summary = summaryResult[0];
            const netCashFlow = summary.total_receipts - summary.total_payments;

            return {
                success: true,
                data: {
                    opening_balance: parseFloat(openingBalance),
                    total_receipts: parseFloat(summary.total_receipts),
                    total_payments: parseFloat(summary.total_payments),
                    net_cash_flow: parseFloat(netCashFlow),
                    closing_balance: parseFloat(closingBalance),
                    total_transactions: parseInt(summary.total_transactions),
                    receipt_count: parseInt(summary.receipt_count),
                    payment_count: parseInt(summary.payment_count)
                }
            };
        } catch (error) {
            console.error('Error fetching cash book summary:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch cash book summary'
            };
        }
    }

    // ✅ Get daily cash summary
    static async getDailyCashSummary(filters = {}) {
        try {
            const { startDate, endDate, cashAccountId } = filters;

            let whereConditions = ['al.is_active = TRUE'];
            let queryParams = [];

            // Cash account filter
            if (cashAccountId) {
                whereConditions.push('al.sub_account_head_id = ?');
                queryParams.push(cashAccountId);
            } else {
                const [cashAccounts] = await db.query(`
                    SELECT cash_sub_account_id FROM cash_book_config WHERE is_active = TRUE
                `);
                
                if (cashAccounts.length > 0) {
                    const cashAccountIds = cashAccounts.map(ca => ca.cash_sub_account_id);
                    whereConditions.push(`al.sub_account_head_id IN (${cashAccountIds.map(() => '?').join(',')})`);
                    queryParams.push(...cashAccountIds);
                }
            }

            // Date range filter
            if (startDate) {
                whereConditions.push('al.transaction_date >= ?');
                queryParams.push(startDate);
            }
            if (endDate) {
                whereConditions.push('al.transaction_date <= ?');
                queryParams.push(endDate);
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

            const [dailySummary] = await db.query(`
                SELECT 
                    al.transaction_date,
                    COALESCE(SUM(al.debit_amount), 0) as daily_payments,
                    COALESCE(SUM(al.credit_amount), 0) as daily_receipts,
                    COUNT(*) as daily_transactions,
                    COUNT(CASE WHEN al.debit_amount > 0 THEN 1 END) as payment_count,
                    COUNT(CASE WHEN al.credit_amount > 0 THEN 1 END) as receipt_count
                FROM account_ledger al
                ${whereClause}
                GROUP BY al.transaction_date
                ORDER BY al.transaction_date DESC
            `, queryParams);

            return {
                success: true,
                data: dailySummary.map(day => ({
                    ...day,
                    daily_payments: parseFloat(day.daily_payments),
                    daily_receipts: parseFloat(day.daily_receipts),
                    net_cash_flow: parseFloat(day.daily_receipts - day.daily_payments),
                    daily_transactions: parseInt(day.daily_transactions),
                    payment_count: parseInt(day.payment_count),
                    receipt_count: parseInt(day.receipt_count)
                }))
            };
        } catch (error) {
            console.error('Error fetching daily cash summary:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch daily cash summary'
            };
        }
    }

    // ✅ Setup cash accounts
    static async setupCashAccount(accountHeadId, subAccountId, isDefault = false) {
        try {
            // If setting as default, remove default from others
            if (isDefault) {
                await db.query(`
                    UPDATE cash_book_config 
                    SET is_default = FALSE 
                    WHERE is_active = TRUE
                `);
            }

            // Check if already exists
            const [existing] = await db.query(`
                SELECT id FROM cash_book_config 
                WHERE cash_account_head_id = ? AND cash_sub_account_id = ? AND is_active = TRUE
            `, [accountHeadId, subAccountId]);

            if (existing.length > 0) {
                // Update existing
                await db.query(`
                    UPDATE cash_book_config 
                    SET is_default = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `, [isDefault, existing[0].id]);
            } else {
                // Insert new
                await db.query(`
                    INSERT INTO cash_book_config 
                    (cash_account_head_id, cash_sub_account_id, is_default)
                    VALUES (?, ?, ?)
                `, [accountHeadId, subAccountId, isDefault]);
            }

            return {
                success: true,
                message: 'Cash account configured successfully'
            };
        } catch (error) {
            console.error('Error setting up cash account:', error);
            return {
                success: false,
                error: error.message || 'Failed to setup cash account'
            };
        }
    }
}

module.exports = CashBook;
