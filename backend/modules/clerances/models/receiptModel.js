const pool = require('../../../config/db');

async function getAllReceipts(filters = {}) {
  try {
    let query = 'SELECT * FROM receipts WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.receipt_no) {
      query += ' AND receipt_no LIKE ?';
      params.push(`%${filters.receipt_no}%`);
    }
    
    if (filters.client_name) {
      query += ' AND client_name LIKE ?';
      params.push(`%${filters.client_name}%`);
    }
    
    if (filters.operation_no) {
      query += ' AND operation_no LIKE ?';
      params.push(`%${filters.operation_no}%`);
    }
    
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Database error in getAllReceipts:', error);
    throw new Error('Failed to fetch receipts from database');
  }
}

async function getReceiptById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM receipts WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Database error in getReceiptById:', error);
    throw new Error('Failed to fetch receipt from database');
  }
}

async function createReceipt(data) {
  try {
    const { 
      receipt_no, 
      operation_no, 
      client_name, 
      amount, 
      issue_date, 
      payment_method 
    } = data;
    
    // Validate required fields
    if (!receipt_no || !client_name || !amount || !issue_date) {
      throw new Error('Missing required fields: receipt_no, client_name, amount, issue_date');
    }

    // Check if receipt number already exists
    const [existingReceipt] = await pool.query(
      'SELECT id FROM receipts WHERE receipt_no = ?', 
      [receipt_no]
    );
    if (existingReceipt.length > 0) {
      throw new Error('Receipt number already exists');
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new Error('Amount must be a positive number');
    }

    const [result] = await pool.query(
      `INSERT INTO receipts 
       (receipt_no, operation_no, client_name, amount, issue_date, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [receipt_no, operation_no, client_name, amount, issue_date, payment_method || 'Cash']
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Database error in createReceipt:', error);
    throw error;
  }
}

async function updateReceipt(id, data) {
  try {
    const { 
      receipt_no, 
      operation_no, 
      client_name, 
      amount, 
      issue_date, 
      payment_method 
    } = data;
    
    // Validate that the receipt exists
    const [existingReceipt] = await pool.query('SELECT id FROM receipts WHERE id = ?', [id]);
    if (existingReceipt.length === 0) {
      throw new Error('Receipt not found');
    }

    // Check if receipt number already exists for other records
    const [duplicateReceipt] = await pool.query(
      'SELECT id FROM receipts WHERE receipt_no = ? AND id != ?', 
      [receipt_no, id]
    );
    if (duplicateReceipt.length > 0) {
      throw new Error('Receipt number already exists');
    }

    await pool.query(
      `UPDATE receipts 
       SET receipt_no = ?, operation_no = ?, client_name = ?, 
           amount = ?, issue_date = ?, payment_method = ?
       WHERE id = ?`,
      [receipt_no, operation_no, client_name, amount, issue_date, payment_method, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Database error in updateReceipt:', error);
    throw error;
  }
}

async function cancelReceipt(id, cancellationData) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get receipt details
    const [receiptRows] = await connection.query('SELECT * FROM receipts WHERE id = ?', [id]);
    if (receiptRows.length === 0) {
      throw new Error('Receipt not found');
    }
    
    const receipt = receiptRows[0];
    
    // Check if already cancelled
    if (receipt.status === 'Cancelled') {
      throw new Error('Receipt is already cancelled');
    }
    
    // Update receipt status
    await connection.query(
      'UPDATE receipts SET status = ? WHERE id = ?',
      ['Cancelled', id]
    );
    
    // Insert cancellation record
    await connection.query(
      `INSERT INTO receipt_cancellations 
       (receipt_id, receipt_no, cancellation_reason, cancellation_date, cancelled_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id, 
        receipt.receipt_no, 
        cancellationData.reason, 
        cancellationData.cancellation_date,
        cancellationData.cancelled_by || 'System'
      ]
    );
    
    await connection.commit();
    return { id, status: 'Cancelled' };
    
  } catch (error) {
    await connection.rollback();
    console.error('Database error in cancelReceipt:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteReceipt(id) {
  try {
    const [existingReceipt] = await pool.query('SELECT id FROM receipts WHERE id = ?', [id]);
    if (existingReceipt.length === 0) {
      throw new Error('Receipt not found');
    }

    await pool.query('DELETE FROM receipts WHERE id = ?', [id]);
    return { id };
  } catch (error) {
    console.error('Database error in deleteReceipt:', error);
    throw error;
  }
}

// Get next receipt number
async function getNextReceiptNumber() {
  try {
    const [rows] = await pool.query(`
      SELECT receipt_no 
      FROM receipts 
      WHERE receipt_no LIKE 'RCP-%' 
      ORDER BY CAST(SUBSTRING(receipt_no, 5) AS UNSIGNED) DESC 
      LIMIT 1
    `);
    
    let nextNumber = 1;
    if (rows.length > 0) {
      const lastNumber = rows[0].receipt_no;
      const numberPart = parseInt(lastNumber.replace('RCP-', '').split('-')[1]);
      nextNumber = numberPart + 1;
    }
    
    const currentYear = new Date().getFullYear();
    const nextReceiptNo = `RCP-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
    
    return nextReceiptNo;
  } catch (error) {
    console.error('Database error in getNextReceiptNumber:', error);
    throw error;
  }
}

// Get cancellation history
async function getCancellationHistory(receiptId) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM receipt_cancellations 
      WHERE receipt_id = ?
      ORDER BY created_at DESC
    `, [receiptId]);
    return rows;
  } catch (error) {
    console.error('Database error in getCancellationHistory:', error);
    throw error;
  }
}
async function createReceipt(data) {
    try {
      const { 
        receipt_no, 
        operation_no, 
        client_name, 
        amount,
        net_amount,
        issue_date,
        due_date,
        payment_method,
        receipt_type,
        description,
        tax_amount,
        discount_amount,
        currency,
        reference_no,
        notes
      } = data;
      
      // Validate required fields
      if (!receipt_no || !client_name || !amount || !net_amount || !issue_date) {
        throw new Error('Missing required fields: receipt_no, client_name, amount, net_amount, issue_date');
      }
  
      // Check if receipt number already exists
      const [existingReceipt] = await pool.query(
        'SELECT id FROM receipts WHERE receipt_no = ?', 
        [receipt_no]
      );
      if (existingReceipt.length > 0) {
        throw new Error('Receipt number already exists');
      }
  
      // Validate amounts
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Amount must be a positive number');
      }
  
      const [result] = await pool.query(
        `INSERT INTO receipts 
         (receipt_no, operation_no, client_name, amount, net_amount, issue_date, due_date,
          payment_method, receipt_type, description, tax_amount, discount_amount, 
          currency, reference_no, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          receipt_no, operation_no, client_name, amount, net_amount, issue_date, due_date,
          payment_method || 'Cash', receipt_type || 'Payment', description,
          tax_amount || 0, discount_amount || 0, currency || 'SAR', reference_no, notes
        ]
      );
      
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Database error in createReceipt:', error);
      throw error;
    }
  }
  
  // Update the updateReceipt function similarly
  async function updateReceipt(id, data) {
    try {
      const { 
        receipt_no, 
        operation_no, 
        client_name, 
        amount,
        net_amount,
        issue_date,
        due_date,
        payment_method,
        receipt_type,
        description,
        tax_amount,
        discount_amount,
        currency,
        reference_no,
        notes
      } = data;
      
      // Validate that the receipt exists
      const [existingReceipt] = await pool.query('SELECT id FROM receipts WHERE id = ?', [id]);
      if (existingReceipt.length === 0) {
        throw new Error('Receipt not found');
      }
  
      // Check if receipt number already exists for other records
      const [duplicateReceipt] = await pool.query(
        'SELECT id FROM receipts WHERE receipt_no = ? AND id != ?', 
        [receipt_no, id]
      );
      if (duplicateReceipt.length > 0) {
        throw new Error('Receipt number already exists');
      }
  
      await pool.query(
        `UPDATE receipts 
         SET receipt_no = ?, operation_no = ?, client_name = ?, amount = ?, net_amount = ?,
             issue_date = ?, due_date = ?, payment_method = ?, receipt_type = ?,
             description = ?, tax_amount = ?, discount_amount = ?, currency = ?,
             reference_no = ?, notes = ?
         WHERE id = ?`,
        [
          receipt_no, operation_no, client_name, amount, net_amount, issue_date, due_date,
          payment_method, receipt_type, description, tax_amount, discount_amount,
          currency, reference_no, notes, id
        ]
      );
      
      return { id, ...data };
    } catch (error) {
      console.error('Database error in updateReceipt:', error);
      throw error;
    }
  }
module.exports = {
  getAllReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  cancelReceipt,
  deleteReceipt,
  getNextReceiptNumber,
  getCancellationHistory,
  createReceipt,
  updateReceipt
};
