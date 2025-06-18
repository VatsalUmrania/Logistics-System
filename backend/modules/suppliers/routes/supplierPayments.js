const express = require('express');
const router = express.Router();
const db = require('../../../config/db');

// GET all supplier payments (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let sql = `
      SELECT sp.*, pt.label AS payment_type_label, GROUP_CONCAT(pd.id) AS payment_detail_ids
      FROM supplier_payments sp
      JOIN payment_types pt ON sp.payment_type_id = pt.id
      LEFT JOIN payment_details pd ON pd.payment_id = sp.id
    `;
    const params = [];

    if (search) {
      sql += ` WHERE sp.voucher_no LIKE ? OR pd.receipt_no LIKE ? `;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` GROUP BY sp.id ORDER BY sp.payment_date DESC`;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single supplier payment (with its details)
router.get('/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;

    const [[payment]] = await db.query(`
      SELECT sp.*, pt.label AS payment_type_label 
      FROM supplier_payments sp 
      JOIN payment_types pt ON sp.payment_type_id = pt.id
      WHERE sp.id = ?
    `, [paymentId]);

    const [details] = await db.query('SELECT * FROM payment_details WHERE payment_id = ?', [paymentId]);

    res.json({ ...payment, details });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new supplier payment (and its details)
router.post('/', async (req, res) => {
  try {
    const { voucher_no, payment_date, amount, payment_type_id, remarks, details } = req.body;

    const [result] = await db.query(
      `INSERT INTO supplier_payments (voucher_no, payment_date, amount, payment_type_id, remarks) VALUES (?, ?, ?, ?, ?)`,
      [voucher_no, payment_date, amount, payment_type_id, remarks]
    );

    const paymentId = result.insertId;

    if (Array.isArray(details) && details.length > 0) {
      for (const d of details) {
        await db.query(
          `INSERT INTO payment_details (payment_id, supplier_id, operation_no, receipt_no, bill_amount, paid_amount, balance_amount)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            paymentId,
            d.supplier_id,
            d.operation_no,
            d.receipt_no,
            d.bill_amount,
            d.paid_amount,
            d.balance_amount
          ]
        );
      }
    }

    res.json({ success: true, payment_id: paymentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE supplier payment
router.put('/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { voucher_no, payment_date, amount, payment_type_id, remarks, details } = req.body;

    await db.query(
      `UPDATE supplier_payments 
       SET voucher_no=?, payment_date=?, amount=?, payment_type_id=?, remarks=? 
       WHERE id=?`,
      [voucher_no, payment_date, amount, payment_type_id, remarks, paymentId]
    );

    // Optionally update payment_details — not implemented here
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supplier payment (and its details)
router.delete('/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;

    await db.query('DELETE FROM payment_details WHERE payment_id = ?', [paymentId]);
    await db.query('DELETE FROM supplier_payments WHERE id = ?', [paymentId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
