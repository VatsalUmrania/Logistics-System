// models/bills.js
const db = require('../../../config/db');

const Bills = {
  // CREATE Bill
  create: async (data) => {
    try {
      const { operation_id, clientRef, doDate, doNo, endorseNo, billNo } = data;
      
      const [result] = await db.query(
        `INSERT INTO bills (operation_id, clientRef, doDate, doNo, endorseNo, billNo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [operation_id, clientRef, doDate, doNo, endorseNo, billNo]
      );

      return result;
    } catch (err) {
      throw err;
    }
  },

  // GET all Bills
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM bills');
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // GET Bill by Operation ID
  getByOperationId: async (operation_id) => {
    try {
      const [rows] = await db.query('SELECT * FROM bills WHERE operation_id = ?', [operation_id]);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // GET single Bill by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM bills WHERE id = ?', [id]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  // UPDATE Bill
  update: async (id, data) => {
    try {
      const { clientRef, doDate, doNo, endorseNo, billNo } = data;
      
      const [result] = await db.query(
        `UPDATE bills SET clientRef = ?, doDate = ?, doNo = ?, endorseNo = ?, billNo = ?
         WHERE id = ?`,
        [clientRef, doDate, doNo, endorseNo, billNo, id]
      );

      return result;
    } catch (err) {
      throw err;
    }
  },

  // DELETE Bill
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM bills WHERE id = ?', [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = Bills;
