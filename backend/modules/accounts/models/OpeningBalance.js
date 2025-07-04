const db = require('../../../config/db');

class OpeningBalance {
    // ✅ Pre-Check: Verify tables exist before operations
    static async checkTablesExist() {
        try {
            const [tables] = await db.query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME IN ('opening_balances', 'account_heads', 'sub_account_heads')
            `);
            
            const tableNames = tables.map(table => table.TABLE_NAME);
            const requiredTables = ['opening_balances', 'account_heads', 'sub_account_heads'];
            
            return requiredTables.every(table => tableNames.includes(table));
        } catch (error) {
            console.error('Error checking tables existence:', error);
            return false;
        }
    }

    // ✅ Pre-Check: Verify account head and sub account head exist and are active
    static async validateAccountReferences(accountHeadId, subAccountHeadId) {
        try {
            const [accountCheck] = await db.query(`
                SELECT ah.id, ah.account_head, ah.is_active as ah_active,
                       sah.id as sub_id, sah.sub_account_head, sah.is_active as sah_active
                FROM account_heads ah
                LEFT JOIN sub_account_heads sah ON sah.id = ? AND sah.account_head_id = ah.id
                WHERE ah.id = ?
            `, [subAccountHeadId, accountHeadId]);

            if (accountCheck.length === 0) {
                return { valid: false, error: 'Account head not found' };
            }

            const account = accountCheck[0];
            
            if (!account.ah_active) {
                return { valid: false, error: 'Account head is inactive' };
            }

            if (!account.sub_id) {
                return { valid: false, error: 'Sub account head not found or does not belong to this account head' };
            }

            if (!account.sah_active) {
                return { valid: false, error: 'Sub account head is inactive' };
            }

            return { valid: true, account };
        } catch (error) {
            console.error('Error validating account references:', error);
            return { valid: false, error: 'Database error during validation' };
        }
    }

    // ✅ Graceful: Get all with comprehensive error handling
    static async getAll(page = 1, limit = 10, search = '') {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const offset = (page - 1) * limit;
            
            let whereClause = 'WHERE ob.is_active = TRUE';
            const queryParams = [];
            
            if (search) {
                whereClause += ` AND (
                    ah.account_head LIKE ? OR 
                    sah.sub_account_head LIKE ? OR 
                    ob.description LIKE ?
                )`;
                const searchParam = `%${search}%`;
                queryParams.push(searchParam, searchParam, searchParam);
            }

            // Get total count
            const [countResult] = await db.query(`
                SELECT COUNT(*) as total
                FROM opening_balances ob
                INNER JOIN account_heads ah ON ob.account_head_id = ah.id
                INNER JOIN sub_account_heads sah ON ob.sub_account_head_id = sah.id
                ${whereClause}
            `, queryParams);

            // Get paginated data
            const [rows] = await db.query(`
                SELECT 
                    ob.id,
                    ob.account_head_id,
                    ob.sub_account_head_id,
                    ob.balance_date as date,
                    ob.balance_type as type,
                    ob.amount,
                    ob.description,
                    ah.account_head,
                    ah.account_type,
                    sah.sub_account_head,
                    ob.created_at,
                    ob.updated_at
                FROM opening_balances ob
                INNER JOIN account_heads ah ON ob.account_head_id = ah.id
                INNER JOIN sub_account_heads sah ON ob.sub_account_head_id = sah.id
                ${whereClause}
                ORDER BY ob.balance_date DESC, ob.id DESC
                LIMIT ? OFFSET ?
            `, [...queryParams, limit, offset]);

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                data: {
                    data: rows,
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages
                }
            };
        } catch (error) {
            console.error('Error in getAll:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch opening balances'
            };
        }
    }

    // ✅ Graceful: Get totals with error handling
    static async getTotals() {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const [rows] = await db.query(`
                SELECT 
                    COALESCE(SUM(CASE WHEN balance_type = 'Debit' THEN amount ELSE 0 END), 0) as total_debit,
                    COALESCE(SUM(CASE WHEN balance_type = 'Credit' THEN amount ELSE 0 END), 0) as total_credit,
                    COALESCE(SUM(CASE WHEN balance_type = 'Debit' THEN amount ELSE -amount END), 0) as net_balance,
                    COUNT(*) as total_entries
                FROM opening_balances 
                WHERE is_active = TRUE
            `);

            return {
                success: true,
                data: rows[0]
            };
        } catch (error) {
            console.error('Error in getTotals:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch totals',
                data: {
                    total_debit: 0,
                    total_credit: 0,
                    net_balance: 0,
                    total_entries: 0
                }
            };
        }
    }

    // ✅ Pre-Check & Graceful: Create with comprehensive validation
    static async create(data) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const { account_head_id, sub_account_head_id, balance_date, balance_type, amount, description } = data;

            // Pre-check: Validate account references
            const validation = await this.validateAccountReferences(account_head_id, sub_account_head_id);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Pre-check: Validate amount
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                throw new Error('Amount must be a positive number');
            }

            // Pre-check: Validate balance type
            if (!['Debit', 'Credit'].includes(balance_type)) {
                throw new Error('Balance type must be either Debit or Credit');
            }

            // Pre-check: Check for duplicate entry
            const [existing] = await db.query(`
                SELECT id FROM opening_balances 
                WHERE account_head_id = ? AND sub_account_head_id = ? AND balance_date = ? AND is_active = TRUE
            `, [account_head_id, sub_account_head_id, balance_date]);

            if (existing.length > 0) {
                throw new Error('Opening balance already exists for this account on this date');
            }

            // Create the record
            const [result] = await db.query(`
                INSERT INTO opening_balances 
                (account_head_id, sub_account_head_id, balance_date, balance_type, amount, description)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [account_head_id, sub_account_head_id, balance_date, balance_type, parseFloat(amount), description || null]);

            return {
                success: true,
                data: { id: result.insertId }
            };
        } catch (error) {
            console.error('Error in create:', error);
            return {
                success: false,
                error: error.message || 'Failed to create opening balance'
            };
        }
    }

    // ✅ Pre-Check & Graceful: Update with validation
    static async update(id, data) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const { account_head_id, sub_account_head_id, balance_date, balance_type, amount, description } = data;

            // Pre-check: Verify record exists
            const [existing] = await db.query(`
                SELECT id FROM opening_balances WHERE id = ? AND is_active = TRUE
            `, [id]);

            if (existing.length === 0) {
                throw new Error('Opening balance record not found');
            }

            // Pre-check: Validate account references
            const validation = await this.validateAccountReferences(account_head_id, sub_account_head_id);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Pre-check: Validate amount
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                throw new Error('Amount must be a positive number');
            }

            // Pre-check: Validate balance type
            if (!['Debit', 'Credit'].includes(balance_type)) {
                throw new Error('Balance type must be either Debit or Credit');
            }

            // Pre-check: Check for duplicate entry (excluding current record)
            const [duplicate] = await db.query(`
                SELECT id FROM opening_balances 
                WHERE account_head_id = ? AND sub_account_head_id = ? AND balance_date = ? 
                AND id != ? AND is_active = TRUE
            `, [account_head_id, sub_account_head_id, balance_date, id]);

            if (duplicate.length > 0) {
                throw new Error('Opening balance already exists for this account on this date');
            }

            // Update the record
            await db.query(`
                UPDATE opening_balances 
                SET account_head_id = ?, sub_account_head_id = ?, balance_date = ?, 
                    balance_type = ?, amount = ?, description = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [account_head_id, sub_account_head_id, balance_date, balance_type, parseFloat(amount), description || null, id]);

            return {
                success: true,
                data: { id }
            };
        } catch (error) {
            console.error('Error in update:', error);
            return {
                success: false,
                error: error.message || 'Failed to update opening balance'
            };
        }
    }

    // ✅ Pre-Check & Graceful: Delete with validation
    static async delete(id) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            // Pre-check: Verify record exists
            const [existing] = await db.query(`
                SELECT id FROM opening_balances WHERE id = ? AND is_active = TRUE
            `, [id]);

            if (existing.length === 0) {
                throw new Error('Opening balance record not found');
            }

            // Soft delete
            await db.query(`
                UPDATE opening_balances 
                SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `, [id]);

            return {
                success: true,
                data: { id }
            };
        } catch (error) {
            console.error('Error in delete:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete opening balance'
            };
        }
    }

    // ✅ Graceful: Get by ID with error handling
    static async getById(id) {
        try {
            // Pre-check: Verify tables exist
            const tablesExist = await this.checkTablesExist();
            if (!tablesExist) {
                throw new Error('Required database tables are missing');
            }

            const [rows] = await db.query(`
                SELECT 
                    ob.id,
                    ob.account_head_id,
                    ob.sub_account_head_id,
                    ob.balance_date as date,
                    ob.balance_type as type,
                    ob.amount,
                    ob.description,
                    ah.account_head,
                    ah.account_type,
                    sah.sub_account_head
                FROM opening_balances ob
                INNER JOIN account_heads ah ON ob.account_head_id = ah.id
                INNER JOIN sub_account_heads sah ON ob.sub_account_head_id = sah.id
                WHERE ob.id = ? AND ob.is_active = TRUE
            `, [id]);

            if (rows.length === 0) {
                return {
                    success: false,
                    error: 'Opening balance record not found'
                };
            }

            return {
                success: true,
                data: rows[0]
            };
        } catch (error) {
            console.error('Error in getById:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch opening balance'
            };
        }
    }
}

module.exports = OpeningBalance;
