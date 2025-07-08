const pool = require('../../../config/db');

async function getAllOtherCharges() {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM other_charges 
      ORDER BY created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('Database error in getAllOtherCharges:', error);
    throw new Error('Failed to fetch other charges from database');
  }
}

async function getOtherChargeById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM other_charges WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Database error in getOtherChargeById:', error);
    throw new Error('Failed to fetch other charge from database');
  }
}

async function createOtherCharge(data) {
  try {
    const { 
      operation_no, 
      client_name, 
      charge_description, 
      charge_amount, 
      vat_percent, 
      vat_amount, 
      total_amount, 
      date_assigned 
    } = data;
    
    // Validate required fields
    if (!client_name || !charge_description || !charge_amount || !total_amount || !date_assigned) {
      throw new Error('Missing required fields: client_name, charge_description, charge_amount, total_amount, date_assigned');
    }

    // Validate numeric fields
    if (isNaN(parseFloat(charge_amount)) || parseFloat(charge_amount) <= 0) {
      throw new Error('charge_amount must be a positive number');
    }

    if (isNaN(parseFloat(total_amount)) || parseFloat(total_amount) <= 0) {
      throw new Error('total_amount must be a positive number');
    }

    // Validate operation_no exists if provided
    if (operation_no) {
      const [operationCheck] = await pool.query(
        'SELECT job_no FROM clearance_operations WHERE job_no = ?', 
        [operation_no]
      );
      if (operationCheck.length === 0) {
        throw new Error('Invalid operation number. Operation does not exist in clearance operations.');
      }
    }

    const [result] = await pool.query(
      `INSERT INTO other_charges 
       (operation_no, client_name, charge_description, charge_amount, vat_percent, vat_amount, total_amount, date_assigned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [operation_no, client_name, charge_description, charge_amount, vat_percent || 0, vat_amount || 0, total_amount, date_assigned]
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Database error in createOtherCharge:', error);
    throw error;
  }
}

async function updateOtherCharge(id, data) {
  try {
    const { 
      operation_no, 
      client_name, 
      charge_description, 
      charge_amount, 
      vat_percent, 
      vat_amount, 
      total_amount, 
      date_assigned 
    } = data;
    
    // Validate that the charge exists
    const [existingCharge] = await pool.query('SELECT id FROM other_charges WHERE id = ?', [id]);
    if (existingCharge.length === 0) {
      throw new Error('Other charge not found.');
    }

    // Validate operation_no exists if provided
    if (operation_no) {
      const [operationCheck] = await pool.query(
        'SELECT job_no FROM clearance_operations WHERE job_no = ?', 
        [operation_no]
      );
      if (operationCheck.length === 0) {
        throw new Error('Invalid operation number. Operation does not exist in clearance operations.');
      }
    }

    await pool.query(
      `UPDATE other_charges 
       SET operation_no = ?, client_name = ?, charge_description = ?, charge_amount = ?, 
           vat_percent = ?, vat_amount = ?, total_amount = ?, date_assigned = ?
       WHERE id = ?`,
      [operation_no, client_name, charge_description, charge_amount, vat_percent || 0, vat_amount || 0, total_amount, date_assigned, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Database error in updateOtherCharge:', error);
    throw error;
  }
}

async function deleteOtherCharge(id) {
  try {
    const [existingCharge] = await pool.query('SELECT id FROM other_charges WHERE id = ?', [id]);
    if (existingCharge.length === 0) {
      throw new Error('Other charge not found.');
    }

    await pool.query('DELETE FROM other_charges WHERE id = ?', [id]);
    return { id };
  } catch (error) {
    console.error('Database error in deleteOtherCharge:', error);
    throw error;
  }
}

// Additional helper functions
async function getOtherChargesByOperationNo(operation_no) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM other_charges 
      WHERE operation_no = ?
      ORDER BY created_at DESC
    `, [operation_no]);
    return rows;
  } catch (error) {
    console.error('Database error in getOtherChargesByOperationNo:', error);
    throw error;
  }
}

async function getOtherChargesByClient(client_name) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM other_charges 
      WHERE client_name LIKE ?
      ORDER BY created_at DESC
    `, [`%${client_name}%`]);
    return rows;
  } catch (error) {
    console.error('Database error in getOtherChargesByClient:', error);
    throw error;
  }
}

module.exports = {
  getAllOtherCharges,
  getOtherChargeById,
  createOtherCharge,
  updateOtherCharge,
  deleteOtherCharge,
  getOtherChargesByOperationNo,
  getOtherChargesByClient
};
