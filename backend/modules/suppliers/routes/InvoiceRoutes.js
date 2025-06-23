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

// Route to fetch all unique job numbers
router.get('/job-numbers', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT job_number 
      FROM invoices 
      WHERE job_number IS NOT NULL AND job_number != ''
      ORDER BY job_number ASC
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/last-job-number', async (req, res) => {
  try {
    const sql = `
      SELECT job_number 
      FROM invoices 
      WHERE job_number IS NOT NULL AND job_number != ''
      ORDER BY invoice_date DESC, id DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(sql);
    
    if (rows.length > 0) {
      res.json({ job_number: rows[0].job_number });
    } else {
      res.json({ job_number: null });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/next-job-number', async (req, res) => {
  try {
    // Fetch last job number
    const sql = `
      SELECT job_number 
      FROM invoices 
      WHERE job_number IS NOT NULL AND job_number != ''
      ORDER BY invoice_date DESC, id DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(sql);

    if (rows.length === 0) {
      // If no job numbers yet, start from JOB-0001 (example)
      return res.json({ job_number: 'JOB-0001' });
    }

    const lastJobNumber = rows[0].job_number; // e.g., "JOB-1013"

    // Extract prefix (non-digit part) and number
    const prefixMatch = lastJobNumber.match(/^\D+/);
    const numberMatch = lastJobNumber.match(/\d+$/);

    if (!prefixMatch || !numberMatch) {
      return res.status(400).json({ error: 'Invalid job number format in DB' });
    }

    const prefix = prefixMatch[0]; // "JOB-"
    const number = parseInt(numberMatch[0], 10); // 1013

    // Increment number by 1
    const nextNumber = number + 1;

    // Optional: zero-pad the number to keep fixed length, e.g., 4 digits
    const numberLength = numberMatch[0].length; // e.g., 4 if "1013"
    const nextNumberStr = String(nextNumber).padStart(numberLength, '0');

    const nextJobNumber = `${prefix}${nextNumberStr}`;

    res.json({ job_number: nextJobNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/next-invoice-number', async (req, res) => {
  try {
    // Get the last invoice number based on invoice_date and id
    const sql = `
      SELECT invoice_no
      FROM invoices
      WHERE invoice_no IS NOT NULL AND invoice_no != ''
      ORDER BY invoice_date DESC, id DESC
      LIMIT 1
    `;
    const [rows] = await db.query(sql);

    if (rows.length === 0) {
      // If no invoices exist, start with INV-0001
      return res.json({ invoice_no: 'INV-0001' });
    }

    const lastInvoiceNo = rows[0].invoice_no; // e.g. "INV-0013"

    // Extract prefix and number
    const prefixMatch = lastInvoiceNo.match(/^\D+/);
    const numberMatch = lastInvoiceNo.match(/\d+$/);

    if (!prefixMatch || !numberMatch) {
      return res.status(400).json({ error: 'Invalid invoice number format in DB' });
    }

    const prefix = prefixMatch[0]; // "INV-"
    const number = parseInt(numberMatch[0], 10); // 13

    // Increment the numeric part by 1
    const nextNumber = number + 1;

    // Zero pad to keep same length
    const numberLength = numberMatch[0].length;
    const nextNumberStr = String(nextNumber).padStart(numberLength, '0');

    const nextInvoiceNo = `${prefix}${nextNumberStr}`;

    res.json({ invoice_no: nextInvoiceNo });
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