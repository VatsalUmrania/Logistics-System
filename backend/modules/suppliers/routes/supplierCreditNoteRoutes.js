const express = require('express');
const router = express.Router();
const db = require('../../../config/db');

// CREATE Supplier Credit Note with Line Items
router.post('/', async (req, res) => {
  const {
    supplier_id,
    credit_note_no,
    credit_note_date,
    total_amount,
    vat_amount,
    grand_total,
    lineItems
  } = req.body;

  if (!supplier_id || !credit_note_no || !credit_note_date || !total_amount || !vat_amount || !grand_total || !Array.isArray(lineItems) || lineItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const pool = await db.getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert into supplier_credit_notes
    const [creditNoteResult] = await conn.execute(
      `INSERT INTO supplier_credit_notes (supplier_id, credit_note_no, credit_note_date, total_amount, vat_amount, grand_total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [supplier_id, credit_note_no, credit_note_date, total_amount, vat_amount, grand_total]
    );
    const credit_note_id = creditNoteResult.insertId;

    // Insert line items
    for (const item of lineItems) {
      if (!item.description || !item.quantity || !item.unit_price || !item.amount) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: 'Line item missing required fields.' });
      }
      await conn.execute(
        `INSERT INTO credit_note_line_items (credit_note_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?)`,
        [credit_note_id, item.description, item.quantity, item.unit_price, item.amount]
      );
    }
    await conn.commit();
    res.json({ success: true, id: credit_note_id });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// READ ALL supplier credit notes with line items and supplier name
router.get('/', async (req, res) => {
  try {
    const pool = await db.getPool();
    // Join with suppliers table for supplier name
    const [notes] = await pool.execute(
      `SELECT scn.*, s.name as supplier_name
       FROM supplier_credit_notes scn
       JOIN suppliers s ON scn.supplier_id = s.id
       ORDER BY scn.created_at DESC`
    );

    // Fetch line items for each note
    for (const note of notes) {
      const [items] = await pool.execute(
        `SELECT * FROM credit_note_line_items WHERE credit_note_id = ?`,
        [note.id]
      );
      note.lineItems = items;
    }

    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// READ single supplier credit note by ID with line items
router.get('/:id', async (req, res) => {
  try {
    const pool = await db.getPool();
    const [notes] = await pool.execute(
      `SELECT scn.*, s.name as supplier_name
       FROM supplier_credit_notes scn
       JOIN suppliers s ON scn.supplier_id = s.id
       WHERE scn.id = ?`,
      [req.params.id]
    );
    if (!notes.length) return res.status(404).json({ success: false, message: 'Not found' });
    const note = notes[0];

    const [items] = await pool.execute(
      `SELECT * FROM credit_note_line_items WHERE credit_note_id = ?`,
      [note.id]
    );
    note.lineItems = items;
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE supplier credit note and line items
router.put('/:id', async (req, res) => {
  const {
    supplier_id,
    credit_note_no,
    credit_note_date,
    total_amount,
    vat_amount,
    grand_total,
    lineItems
  } = req.body;

  if (!supplier_id || !credit_note_no || !credit_note_date || !total_amount || !vat_amount || !grand_total || !Array.isArray(lineItems)) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const pool = await db.getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Update main credit note
    await conn.execute(
      `UPDATE supplier_credit_notes SET supplier_id=?, credit_note_no=?, credit_note_date=?, total_amount=?, vat_amount=?, grand_total=? WHERE id=?`,
      [supplier_id, credit_note_no, credit_note_date, total_amount, vat_amount, grand_total, req.params.id]
    );

    // Remove old line items
    await conn.execute(
      `DELETE FROM credit_note_line_items WHERE credit_note_id=?`,
      [req.params.id]
    );

    // Insert new line items
    for (const item of lineItems) {
      if (!item.description || !item.quantity || !item.unit_price || !item.amount) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: 'Line item missing required fields.' });
      }
      await conn.execute(
        `INSERT INTO credit_note_line_items (credit_note_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, item.description, item.quantity, item.unit_price, item.amount]
      );
    }

    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// DELETE supplier credit note and its line items
router.delete('/:id', async (req, res) => {
  const pool = await db.getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(`DELETE FROM credit_note_line_items WHERE credit_note_id=?`, [req.params.id]);
    await conn.execute(`DELETE FROM supplier_credit_notes WHERE id=?`, [req.params.id]);
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;