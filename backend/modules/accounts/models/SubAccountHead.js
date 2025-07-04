const db = require('../../../config/db');

const SubAccountHead = {
    // Get all sub account heads with optional status filter
    getAll: (includeInactive = false) => {
        let query = `
            SELECT 
                sah.id,
                sah.account_head_id,
                ah.account_head,
                ah.account_type,
                sah.sub_account_head,
                sah.description,
                sah.is_active,
                sah.created_at,
                sah.updated_at
            FROM sub_account_heads sah
            INNER JOIN account_heads ah ON sah.account_head_id = ah.id
            WHERE ah.is_active = TRUE
        `;
        
        if (!includeInactive) {
            query += ' AND sah.is_active = TRUE';
        }
        
        query += ' ORDER BY ah.account_head, sah.sub_account_head';
        
        return db.query(query);
    },

    // Get by ID with account head details (including inactive)
    getById: (id, includeInactive = false) => {
        let query = `
            SELECT 
                sah.id,
                sah.account_head_id,
                ah.account_head,
                ah.account_type,
                sah.sub_account_head,
                sah.description,
                sah.is_active,
                sah.created_at,
                sah.updated_at
            FROM sub_account_heads sah
            INNER JOIN account_heads ah ON sah.account_head_id = ah.id
            WHERE sah.id = ?
        `;
        
        if (!includeInactive) {
            query += ' AND sah.is_active = TRUE';
        }
        
        return db.query(query, [id]);
    },

    // Create new sub account head
    create: ({ account_head_id, sub_account_head, description = null }) =>
        db.query(
            'INSERT INTO sub_account_heads (account_head_id, sub_account_head, description) VALUES (?, ?, ?)',
            [account_head_id, sub_account_head, description]
        ),

    // Update sub account head
    update: (id, { account_head_id, sub_account_head, description = null }) =>
        db.query(
            'UPDATE sub_account_heads SET account_head_id = ?, sub_account_head = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [account_head_id, sub_account_head, description, id]
        ),

    // Soft delete (set is_active to FALSE)
    delete: (id) => db.query(
        'UPDATE sub_account_heads SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
        [id]
    ),

    // Toggle status (activate/deactivate)
    toggleStatus: (id) => db.query(`
        UPDATE sub_account_heads 
        SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `, [id]),

    // Check if sub account head exists
    checkExists: (account_head_id, sub_account_head, excludeId = null) => {
        let query = 'SELECT id FROM sub_account_heads WHERE account_head_id = ? AND sub_account_head = ? AND is_active = TRUE';
        let params = [account_head_id, sub_account_head];
        
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        
        return db.query(query, params);
    },

    // Get account head ID by name (only active ones)
    getAccountHeadIdByName: (accountHeadName) => db.query(
        'SELECT id FROM account_heads WHERE account_head = ? AND is_active = TRUE',
        [accountHeadName]
    ),

    // Get status counts
    getStatusCounts: () => db.query(`
        SELECT 
            SUM(CASE WHEN sah.is_active = TRUE THEN 1 ELSE 0 END) as active_count,
            SUM(CASE WHEN sah.is_active = FALSE THEN 1 ELSE 0 END) as inactive_count,
            COUNT(*) as total_count
        FROM sub_account_heads sah
        INNER JOIN account_heads ah ON sah.account_head_id = ah.id
        WHERE ah.is_active = TRUE
    `),

    // Restore soft-deleted sub account head
    restore: (id) => db.query(
        'UPDATE sub_account_heads SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
    )
};

module.exports = SubAccountHead;
