const pool = require('../../../config/db');

async function getAllDeliveryNotes() {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM delivery_notes 
      ORDER BY created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('Database error in getAllDeliveryNotes:', error);
    throw new Error('Failed to fetch delivery notes from database');
  }
}

async function getDeliveryNoteById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM delivery_notes WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Database error in getDeliveryNoteById:', error);
    throw new Error('Failed to fetch delivery note from database');
  }
}

async function createDeliveryNote(data) {
  try {
    const { 
      delivery_note_no, 
      order_no, 
      client_name, 
      delivery_date, 
      delivered_by, 
      address 
    } = data;
    
    // Validate required fields
    if (!delivery_note_no || !delivery_date) {
      throw new Error('Missing required fields: delivery_note_no, delivery_date');
    }

    // Check if delivery note number already exists
    const [existingNote] = await pool.query(
      'SELECT id FROM delivery_notes WHERE delivery_note_no = ?', 
      [delivery_note_no]
    );
    if (existingNote.length > 0) {
      throw new Error('Delivery note number already exists');
    }

    const [result] = await pool.query(
      `INSERT INTO delivery_notes 
       (delivery_note_no, order_no, client_name, delivery_date, delivered_by, address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [delivery_note_no, order_no, client_name, delivery_date, delivered_by, address]
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Database error in createDeliveryNote:', error);
    throw error;
  }
}

async function updateDeliveryNote(id, data) {
  try {
    const { 
      delivery_note_no, 
      order_no, 
      client_name, 
      delivery_date, 
      delivered_by, 
      address 
    } = data;
    
    // Validate that the delivery note exists
    const [existingNote] = await pool.query('SELECT id FROM delivery_notes WHERE id = ?', [id]);
    if (existingNote.length === 0) {
      throw new Error('Delivery note not found');
    }

    // Check if delivery note number already exists for other records
    const [duplicateNote] = await pool.query(
      'SELECT id FROM delivery_notes WHERE delivery_note_no = ? AND id != ?', 
      [delivery_note_no, id]
    );
    if (duplicateNote.length > 0) {
      throw new Error('Delivery note number already exists');
    }

    await pool.query(
      `UPDATE delivery_notes 
       SET delivery_note_no = ?, order_no = ?, client_name = ?, 
           delivery_date = ?, delivered_by = ?, address = ?
       WHERE id = ?`,
      [delivery_note_no, order_no, client_name, delivery_date, delivered_by, address, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Database error in updateDeliveryNote:', error);
    throw error;
  }
}

async function deleteDeliveryNote(id) {
  try {
    const [existingNote] = await pool.query('SELECT id FROM delivery_notes WHERE id = ?', [id]);
    if (existingNote.length === 0) {
      throw new Error('Delivery note not found');
    }

    await pool.query('DELETE FROM delivery_notes WHERE id = ?', [id]);
    return { id };
  } catch (error) {
    console.error('Database error in deleteDeliveryNote:', error);
    throw error;
  }
}

// Additional helper functions
async function getDeliveryNotesByClient(client_name) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM delivery_notes 
      WHERE client_name LIKE ?
      ORDER BY created_at DESC
    `, [`%${client_name}%`]);
    return rows;
  } catch (error) {
    console.error('Database error in getDeliveryNotesByClient:', error);
    throw error;
  }
}

async function getDeliveryNotesByDateRange(start_date, end_date) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM delivery_notes 
      WHERE delivery_date BETWEEN ? AND ?
      ORDER BY delivery_date DESC
    `, [start_date, end_date]);
    return rows;
  } catch (error) {
    console.error('Database error in getDeliveryNotesByDateRange:', error);
    throw error;
  }
}

module.exports = {
  getAllDeliveryNotes,
  getDeliveryNoteById,
  createDeliveryNote,
  updateDeliveryNote,
  deleteDeliveryNote,
  getDeliveryNotesByClient,
  getDeliveryNotesByDateRange
};
