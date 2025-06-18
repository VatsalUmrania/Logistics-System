const express = require('express');
const router = express.Router();
const db = require('../../../config/db');

// GET all invoices (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search, supplier, job_no, invoice_no } = req.query;
    let sql = `
      SELECT 
        i.id, 
        i.job_number, 
        i.invoice_no, 
        DATE_FORMAT(i.invoice_date, '%Y-%m-%d') AS invoice_date,
        i.bill_amount_without_vat,
        i.vat_amount,
        i.bill_amount,
        s.id AS supplier_id,
        s.name AS supplier_name
      FROM invoices i
      LEFT JOIN invoice_supplier isup ON i.id = isup.invoice_id
      LEFT JOIN suppliers s ON isup.supplier_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (i.invoice_no LIKE ? OR i.job_number LIKE ? OR s.name LIKE ?) `;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (supplier) {
      sql += ` AND s.name LIKE ? `;
      params.push(`%${supplier}%`);
    }
    if (job_no) {
      sql += ` AND i.job_number LIKE ? `;
      params.push(`%${job_no}%`);
    }
    if (invoice_no) {
      sql += ` AND i.invoice_no LIKE ? `;
      params.push(`%${invoice_no}%`);
    }
    sql += ` ORDER BY i.invoice_date DESC, i.id DESC`;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single invoice (with its supplier)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        i.id, 
        i.job_number, 
        i.invoice_no, 
        DATE_FORMAT(i.invoice_date, '%Y-%m-%d') AS invoice_date,
        i.bill_amount_without_vat,
        i.vat_amount,
        i.bill_amount,
        s.id AS supplier_id,
        s.name AS supplier_name
      FROM invoices i
      LEFT JOIN invoice_supplier isup ON i.id = isup.invoice_id
      LEFT JOIN suppliers s ON isup.supplier_id = s.id
      WHERE i.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new invoice (and link to supplier)
router.post('/', async (req, res) => {
  try {
    const { job_number, invoice_no, invoice_date, bill_amount_without_vat, vat_amount, bill_amount, supplier_id } = req.body;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert invoice
      const [invoiceResult] = await connection.execute(
        `INSERT INTO invoices 
          (job_number, invoice_no, invoice_date, bill_amount_without_vat, vat_amount, bill_amount) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [job_number, invoice_no, invoice_date, bill_amount_without_vat, vat_amount, bill_amount]
      );

      // Link to supplier
      if (supplier_id) {
        await connection.execute(
          `INSERT INTO invoice_supplier (invoice_id, supplier_id) VALUES (?, ?)`,
          [invoiceResult.insertId, supplier_id]
        );
      }

      await connection.commit();
      res.status(201).json({ id: invoiceResult.insertId, ...req.body });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE an invoice (and update its supplier link)
router.put('/:id', async (req, res) => {
  try {
    const { job_number, invoice_no, invoice_date, bill_amount_without_vat, vat_amount, bill_amount, supplier_id } = req.body;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update invoice
      await connection.execute(
        `UPDATE invoices 
         SET 
           job_number = ?, 
           invoice_no = ?, 
           invoice_date = ?, 
           bill_amount_without_vat = ?, 
           vat_amount = ?, 
           bill_amount = ?
         WHERE id = ?`,
        [job_number, invoice_no, invoice_date, bill_amount_without_vat, vat_amount, bill_amount, req.params.id]
      );

      // Update supplier relationship
      await connection.execute('DELETE FROM invoice_supplier WHERE invoice_id = ?', [req.params.id]);

      if (supplier_id) {
        await connection.execute(
          'INSERT INTO invoice_supplier (invoice_id, supplier_id) VALUES (?, ?)',
          [req.params.id, supplier_id]
        );
      }

      await connection.commit();
      res.json({ id: req.params.id, ...req.body });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE invoice (and its supplier link)
router.delete('/:id', async (req, res) => {
  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute('DELETE FROM invoice_supplier WHERE invoice_id = ?', [req.params.id]);
      await connection.execute('DELETE FROM invoices WHERE id = ?', [req.params.id]);
      await connection.commit();
      res.status(204).send();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;