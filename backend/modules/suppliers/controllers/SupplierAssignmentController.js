const supplierAssignmentModel = require('../models/SupplierAssignmentModel');
const db = require('../../../config/db');  // adjust path to where your db.js is

exports.createSupplierAssignment = async (req, res) => {
  try {
    const {
      selectedSupplierId,
      supplierInvoiceNo,
      jobNumber,
      invoiceDate,
      vatRate,
      totalAmount,
      vatAmount,
      billTotalWithVAT,
      items
    } = req.body;

    if (!selectedSupplierId || !supplierInvoiceNo || !jobNumber || !invoiceDate || !items) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assignmentId = await supplierAssignmentModel.createAssignment({
      selectedSupplierId,
      supplierInvoiceNo,
      jobNumber,
      invoiceDate,
      vatRate,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    });

    for (const item of items) {
      await supplierAssignmentModel.createAssignmentItem(assignmentId, item);
    }

    const assignment = await supplierAssignmentModel.getAssignmentWithItems(assignmentId);

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLastInvoice = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT supplier_invoice_no 
      FROM supplier_assignments 
      ORDER BY id DESC 
      LIMIT 1
    `);

    const lastInvoice = rows.length > 0 ? rows[0].supplier_invoice_no : null;

    res.json({ lastInvoiceNumber: lastInvoice });
  } catch (err) {
    console.error('DB Error in getLastInvoice:', err);
    res.status(500).json({ message: 'Failed to get last invoice' });
  }
};

exports.getAllSupplierAssignments = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM supplier_assignments ORDER BY invoice_date DESC');
    res.json(rows);
  } catch (error) {
    console.error('DB Error in getAllSupplierAssignments:', error);
    res.status(500).json({ message: 'Failed to get supplier assignments' });
  }
};
