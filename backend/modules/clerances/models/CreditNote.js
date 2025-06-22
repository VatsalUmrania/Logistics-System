const pool = require('../../../config/db');

async function getAllCreditNotes() {
  const [rows] = await pool.query('SELECT * FROM credit_notes');
  return rows;
}

async function getCreditNoteById(id) {
  const [rows] = await pool.query('SELECT * FROM credit_notes WHERE id = ?', [id]);
  return rows[0];
}

async function createCreditNote(data) {
  const { credit_note_no, operation_no, client_name, client_name_ar, amount, date } = data;
  const [result] = await pool.query(
    `INSERT INTO credit_notes 
    (credit_note_no, operation_no, client_name, client_name_ar, amount, date) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [credit_note_no, operation_no, client_name, client_name_ar, amount, date]
  );
  return { id: result.insertId, ...data };
}

async function updateCreditNote(id, data) {
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
}

async function deleteCreditNote(id) {
  await pool.query('DELETE FROM credit_notes WHERE id = ?', [id]);
  return { id };
}

module.exports = {
  getAllCreditNotes,
  getCreditNoteById,
  createCreditNote,
  updateCreditNote,
  deleteCreditNote
};
