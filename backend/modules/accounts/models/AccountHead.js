const db = require('../../../config/db');

class AccountHead {
  // Get all account heads with search and pagination
  static async getAll(searchTerm = '', sortField = 'account_head', sortDirection = 'asc', page = 1, limit = 10) {
    try {
      let query = `
        SELECT id, account_type, account_head, created_at, updated_at 
        FROM account_heads
      `;
      let countQuery = 'SELECT COUNT(*) as total FROM account_heads';
      const params = [];
      const countParams = [];

      // Add search functionality
      if (searchTerm) {
        const searchCondition = ' WHERE (account_head LIKE ? OR account_type LIKE ?)';
        query += searchCondition;
        countQuery += searchCondition;
        const searchParam = `%${searchTerm}%`;
        params.push(searchParam, searchParam);
        countParams.push(searchParam, searchParam);
      }

      // Add sorting
      const validSortFields = ['account_head', 'account_type', 'created_at'];
      const validSortDirections = ['asc', 'desc'];
      
      if (validSortFields.includes(sortField) && validSortDirections.includes(sortDirection)) {
        query += ` ORDER BY ${sortField} ${sortDirection.toUpperCase()}`;
      }

      // Add pagination - Convert to numbers for LIMIT/OFFSET
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(Number(limit), Number(offset));

      // Use query() instead of execute() for LIMIT/OFFSET queries
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

  // Use execute() for non-LIMIT queries
  static async getById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, account_type, account_head, created_at, updated_at FROM account_heads WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(accountData) {
    try {
      const { account_type, account_head } = accountData;
      
      // Check for duplicate account head
      const [existing] = await db.execute(
        'SELECT id FROM account_heads WHERE LOWER(account_head) = LOWER(?)',
        [account_head]
      );
      
      if (existing.length > 0) {
        throw new Error('Account head already exists');
      }

      const [result] = await db.execute(
        'INSERT INTO account_heads (account_type, account_head) VALUES (?, ?)',
        [account_type, account_head]
      );

      return await this.getById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, accountData) {
    try {
      const { account_type, account_head } = accountData;
      
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('Account head not found');
      }

      const [duplicate] = await db.execute(
        'SELECT id FROM account_heads WHERE LOWER(account_head) = LOWER(?) AND id != ?',
        [account_head, id]
      );
      
      if (duplicate.length > 0) {
        throw new Error('Account head already exists');
      }

      await db.execute(
        'UPDATE account_heads SET account_type = ?, account_head = ? WHERE id = ?',
        [account_type, account_head, id]
      );

      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('Account head not found');
      }

      const [result] = await db.execute('DELETE FROM account_heads WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static getAccountTypes() {
    return ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
  }
}

module.exports = AccountHead;
