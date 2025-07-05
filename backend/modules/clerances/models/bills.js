// const db = require('../../../config/db'); // Your database connection

// class Bills {
//   // Create a new bill
//   static async create(data) {
//     try {
//       const { operation_id, clientRef, doDate, doNo, endorseNo, billNo } = data;
//       const [result] = await db.query(
//         `INSERT INTO bills (operation_id, clientRef, doDate, doNo, endorseNo, billNo, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//         [operation_id, clientRef, doDate, doNo, endorseNo, billNo]
//       );
//       return { id: result.insertId, ...data };
//     } catch (err) {
//       console.error('Error creating bill:', err);
//       throw err;
//     }
//   }

//   // Get all bills
//   static async getAll() {
//     try {
//       const [rows] = await db.query(
//         `SELECT * FROM bills ORDER BY created_at DESC`
//       );
//       return rows;
//     } catch (err) {
//       console.error('Error fetching all bills:', err);
//       throw err;
//     }
//   }

//   // Get bill by ID
//   static async getById(id) {
//     try {
//       const [rows] = await db.query(
//         `SELECT * FROM bills WHERE id = ?`,
//         [id]
//       );
//       return rows[0] || null;
//     } catch (err) {
//       console.error('Error fetching bill by ID:', err);
//       throw err;
//     }
//   }

//   // Get bills by operation ID
//   static async getByOperationId(operation_id) {
//     try {
//       const [rows] = await db.query(
//         `SELECT * FROM bills WHERE operation_id = ? ORDER BY created_at DESC`,
//         [operation_id]
//       );
//       return rows;
//     } catch (err) {
//       console.error('Error fetching bills by operation ID:', err);
//       throw err;
//     }
//   }

//   // Update a bill
//   static async update(id, data) {
//     try {
//       const { clientRef, doDate, doNo, endorseNo, billNo } = data;
//       const [result] = await db.query(
//         `UPDATE bills 
//          SET clientRef = ?, doDate = ?, doNo = ?, endorseNo = ?, billNo = ?, updated_at = NOW()
//          WHERE id = ?`,
//         [clientRef, doDate, doNo, endorseNo, billNo, id]
//       );
      
//       if (result.affectedRows === 0) {
//         return null;
//       }
      
//       return await this.getById(id);
//     } catch (err) {
//       console.error('Error updating bill:', err);
//       throw err;
//     }
//   }

//   // Delete a bill
//   static async delete(id) {
//     try {
//       const [result] = await db.query(
//         `DELETE FROM bills WHERE id = ?`,
//         [id]
//       );
//       return result.affectedRows > 0;
//     } catch (err) {
//       console.error('Error deleting bill:', err);
//       throw err;
//     }
//   }

//   // Delete bills by operation ID
//   static async deleteByOperationId(operation_id) {
//     try {
//       const [result] = await db.query(
//         `DELETE FROM bills WHERE operation_id = ?`,
//         [operation_id]
//       );
//       return result.affectedRows;
//     } catch (err) {
//       console.error('Error deleting bills by operation ID:', err);
//       throw err;
//     }
//   }
// }

// module.exports = Bills;


const db = require('../../../config/db');

class Bills {
  // Create a new bill
  static async create(data) {
    try {
      const { operation_id, clientRef, doDate, doNo, endorseNo, billNo } = data;
      const [result] = await db.query(
        `INSERT INTO bills (operation_id, clientRef, doDate, doNo, endorseNo, billNo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [operation_id, clientRef, doDate, doNo, endorseNo, billNo]
      );
      return { id: result.insertId, ...data };
    } catch (err) {
      console.error('Error creating bill:', err);
      throw err;
    }
  }

  // Get all bills
  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT * FROM bills ORDER BY id DESC`
      );
      return rows;
    } catch (err) {
      console.error('Error fetching all bills:', err);
      throw err;
    }
  }

  // Get bill by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM bills WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error('Error fetching bill by ID:', err);
      throw err;
    }
  }

  // Get bills by operation ID
  static async getByOperationId(operation_id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM bills WHERE operation_id = ? ORDER BY id DESC`,
        [operation_id]
      );
      return rows;
    } catch (err) {
      console.error('Error fetching bills by operation ID:', err);
      throw err;
    }
  }

  // Update a bill
  static async update(id, data) {
    try {
      const { clientRef, doDate, doNo, endorseNo, billNo } = data;
      const [result] = await db.query(
        `UPDATE bills 
         SET clientRef = ?, doDate = ?, doNo = ?, endorseNo = ?, billNo = ?
         WHERE id = ?`,
        [clientRef, doDate, doNo, endorseNo, billNo, id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.getById(id);
    } catch (err) {
      console.error('Error updating bill:', err);
      throw err;
    }
  }

  // Delete a bill
  static async delete(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM bills WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error('Error deleting bill:', err);
      throw err;
    }
  }

  // Delete bills by operation ID
  static async deleteByOperationId(operation_id) {
    try {
      const [result] = await db.query(
        `DELETE FROM bills WHERE operation_id = ?`,
        [operation_id]
      );
      return result.affectedRows;
    } catch (err) {
      console.error('Error deleting bills by operation ID:', err);
      throw err;
    }
  }
}

module.exports = Bills;
