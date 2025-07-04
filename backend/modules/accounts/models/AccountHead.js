const db = require('../../../config/db');

class AccountHead {
  // Get all account heads with search and pagination (including inactive ones with filter)
  static async getAll(searchTerm = '', sortField = 'account_head', sortDirection = 'asc', page = 1, limit = 10, includeInactive = false) {
    try {
      let query = `
        SELECT id, account_type, account_head, description, is_active, created_at, updated_at
        FROM account_heads
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM account_heads';
      
      const params = [];
      const countParams = [];

      // Add active/inactive filter
      if (!includeInactive) {
        query += ' WHERE is_active = TRUE';
        countQuery += ' WHERE is_active = TRUE';
      }

      // Add search functionality
      if (searchTerm) {
        const searchCondition = includeInactive 
          ? ' WHERE (account_head LIKE ? OR account_type LIKE ? OR description LIKE ?)'
          : ' AND (account_head LIKE ? OR account_type LIKE ? OR description LIKE ?)';
        
        query += searchCondition;
        countQuery += searchCondition;
        const searchParam = `%${searchTerm}%`;
        params.push(searchParam, searchParam, searchParam);
        countParams.push(searchParam, searchParam, searchParam);
      }

      // Add sorting
      const validSortFields = ['account_head', 'account_type', 'created_at', 'updated_at', 'is_active'];
      const validSortDirections = ['asc', 'desc'];
      if (validSortFields.includes(sortField) && validSortDirections.includes(sortDirection)) {
        query += ` ORDER BY ${sortField} ${sortDirection.toUpperCase()}`;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(Number(limit), Number(offset));

      const [rows] = await db.query(query, params);
      const [countResult] = await db.query(countQuery, countParams);

      return {
        data: rows,
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  // Get account head by ID (including inactive ones)
  static async getById(id, includeInactive = false) {
    try {
      const condition = includeInactive ? 'WHERE id = ?' : 'WHERE id = ? AND is_active = TRUE';
      const [rows] = await db.execute(
        `SELECT id, account_type, account_head, description, is_active, created_at, updated_at FROM account_heads ${condition}`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new account head
  static async create(accountData) {
    try {
      const { account_type, account_head, description = null } = accountData;

      // Check for duplicate account head (only among active ones)
      const [existing] = await db.execute(
        'SELECT id FROM account_heads WHERE LOWER(account_head) = LOWER(?) AND is_active = TRUE',
        [account_head]
      );

      if (existing.length > 0) {
        throw new Error('Account head already exists');
      }

      const [result] = await db.execute(
        'INSERT INTO account_heads (account_type, account_head, description) VALUES (?, ?, ?)',
        [account_type, account_head, description]
      );

      return await this.getById(result.insertId, true);
    } catch (error) {
      throw error;
    }
  }

  // Update account head
  static async update(id, accountData) {
    try {
      const { account_type, account_head, description = null } = accountData;

      const existing = await this.getById(id, true);
      if (!existing) {
        throw new Error('Account head not found');
      }

      // Check for duplicate account head (excluding current record and only among active ones)
      const [duplicate] = await db.execute(
        'SELECT id FROM account_heads WHERE LOWER(account_head) = LOWER(?) AND id != ? AND is_active = TRUE',
        [account_head, id]
      );

      if (duplicate.length > 0) {
        throw new Error('Account head already exists');
      }

      await db.execute(
        'UPDATE account_heads SET account_type = ?, account_head = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [account_type, account_head, description, id]
      );

      return await this.getById(id, true);
    } catch (error) {
      throw error;
    }
  }

  // Toggle status (activate/deactivate)
  static async toggleStatus(id) {
    try {
      const existing = await this.getById(id, true);
      if (!existing) {
        throw new Error('Account head not found');
      }

      const newStatus = !existing.is_active;
      await db.execute(
        'UPDATE account_heads SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newStatus, id]
      );

      return await this.getById(id, true);
    } catch (error) {
      throw error;
    }
  }

  // Soft delete account head
  static async delete(id) {
    try {
      const existing = await this.getById(id, true);
      if (!existing) {
        throw new Error('Account head not found');
      }

      const [result] = await db.execute(
        'UPDATE account_heads SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Restore soft-deleted account head
  static async restore(id) {
    try {
      const [result] = await db.execute(
        'UPDATE account_heads SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get account types
  static getAccountTypes() {
    return ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
  }

  // Get active account heads for dropdown
  static async getActiveAccountHeads() {
    try {
      const [rows] = await db.execute(
        'SELECT id, account_head, account_type FROM account_heads WHERE is_active = TRUE ORDER BY account_head'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get status counts
  static async getStatusCounts() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_count,
          SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) as inactive_count,
          COUNT(*) as total_count
        FROM account_heads
      `);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccountHead;
