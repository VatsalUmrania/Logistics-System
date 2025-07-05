const pool = require('../../../config/db');

async function getAllCreditNotes() {
  try {
    const [rows] = await pool.query('SELECT * FROM credit_notes ORDER BY id DESC');
    return rows;
  } catch (error) {
    console.error('Database error in getAllCreditNotes:', error);
    throw new Error('Failed to fetch credit notes from database');
  }
}

async function getCreditNoteById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM credit_notes WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Database error in getCreditNoteById:', error);
    throw new Error('Failed to fetch credit note from database');
  }
}

async function createCreditNote(data) {
  try {
    const { credit_note_no, operation_no, client_name, client_name_ar, amount, date } = data;
    
    // Validate required fields
    if (!credit_note_no || !amount || !date) {
      throw new Error('Missing required fields: credit_note_no, amount, date');
    }
    
    const [result] = await pool.query(
      `INSERT INTO credit_notes
      (credit_note_no, operation_no, client_name, client_name_ar, amount, date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [credit_note_no, operation_no, client_name, client_name_ar, amount, date]
    );
    
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error('Database error in createCreditNote:', error);
    throw new Error('Failed to create credit note');
  }
}

async function updateCreditNote(id, data) {
  try {
    const { credit_note_no, operation_no, client_name, client_name_ar, amount, date } = data;
    
    await pool.query(
      `UPDATE credit_notes SET
      credit_note_no = ?,
      operation_no = ?,
      client_name = ?,
      client_name_ar = ?,
      amount = ?,
      date = ?
      WHERE id = ?`,
      [credit_note_no, operation_no, client_name, client_name_ar, amount, date, id]
    );
    
    return { id, ...data };
  } catch (error) {
    console.error('Database error in updateCreditNote:', error);
    throw new Error('Failed to update credit note');
  }
}

async function deleteCreditNote(id) {
  try {
    const [result] = await pool.query('DELETE FROM credit_notes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      throw new Error('Credit note not found');
    }
    
    return { id };
  } catch (error) {
    console.error('Database error in deleteCreditNote:', error);
    throw new Error('Failed to delete credit note');
  }
}

module.exports = {
  getAllCreditNotes,
  getCreditNoteById,
  createCreditNote,
  updateCreditNote,
  deleteCreditNote
};
