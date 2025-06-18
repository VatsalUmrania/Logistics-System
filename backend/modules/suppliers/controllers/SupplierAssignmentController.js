// const supplierAssignmentModel = require('../models/SupplierAssignmentModel');
// const db = require('../../../config/db');  // adjust path to where your db.js is

// exports.createSupplierAssignment = async (req, res) => {
//   try {
//     const {
//       selectedSupplierId,
//       supplierInvoiceNo,
//       jobNumber,
//       invoiceDate,
//       vatRate,
//       totalAmount,
//       vatAmount,
//       billTotalWithVAT,
//       items
//     } = req.body;

//     if (!selectedSupplierId || !supplierInvoiceNo || !jobNumber || !invoiceDate || !items) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const assignmentId = await supplierAssignmentModel.createAssignment({
//       selectedSupplierId,
//       supplierInvoiceNo,
//       jobNumber,
//       invoiceDate,
//       vatRate,
//       totalAmount,
//       vatAmount,
//       billTotalWithVAT
//     });

//     for (const item of items) {
//       await supplierAssignmentModel.createAssignmentItem(assignmentId, item);
//     }

//     const assignment = await supplierAssignmentModel.getAssignmentWithItems(assignmentId);

//     res.status(201).json(assignment);
//   } catch (error) {
//     console.error('Error in controller:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.getLastInvoice = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT supplier_invoice_no 
//       FROM supplier_assignments 
//       ORDER BY id DESC 
//       LIMIT 1
//     `);

//     const lastInvoice = rows.length > 0 ? rows[0].supplier_invoice_no : null;

//     res.json({ lastInvoiceNumber: lastInvoice });
//   } catch (err) {
//     console.error('DB Error in getLastInvoice:', err);
//     res.status(500).json({ message: 'Failed to get last invoice' });
//   }
// };

// exports.getAllSupplierAssignments = async (req, res) => {
//   try {
//     const assignments = await supplierAssignmentsModel.getAllSupplierAssignments();
//     res.json(assignments);
//   } catch (error) {
//     console.error('Controller Error - getAllSupplierAssignments:', error);
//     res.status(500).json({ message: 'Failed to get supplier assignments' });
//   }
// };

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
    const assignments = await supplierAssignmentModel.getAllSupplierAssignments();
    res.json({
      success: true,
      count: assignments?.length || 0,
      data: assignments || []
    });
  } catch (error) {
    console.error('Controller Error - getAllSupplierAssignments:', error);
    res.status(500).json({ 
      message: 'Failed to get supplier assignments', 
      error: error.message
    });
  }
};

exports.updateSupplierAssignment = async (req, res) => {
  try {
    const { id } = req.params; // Assignment ID from URL
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

    if (!id || !selectedSupplierId || !supplierInvoiceNo || !jobNumber || !invoiceDate || !items) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update the main assignment details
    await supplierAssignmentModel.updateAssignment(id, {
      selectedSupplierId,
      supplierInvoiceNo,
      jobNumber,
      invoiceDate,
      vatRate,
      totalAmount,
      vatAmount,
      billTotalWithVAT
    });

    // Delete existing items for the assignment
    await supplierAssignmentModel.deleteAssignmentItems(id);

    // Insert updated items
    for (const item of items) {
      await supplierAssignmentModel.createAssignmentItem(id, item);
    }

    const updatedAssignment = await supplierAssignmentModel.getAssignmentWithItems(id);

    res.json(updatedAssignment);
  } catch (error) {
    console.error('Controller Error - updateSupplierAssignment:', error);
    res.status(500).json({ message: 'Failed to update supplier assignment', error: error.message });
  }
};

exports.deleteSupplierAssignment = async (req, res) => {
  try {
    const { id } = req.params; // Assignment ID from URL

    if (!id) {
      return res.status(400).json({ message: 'Missing required assignment ID' });
    }

    // Delete the assignment and its items
    await supplierAssignmentModel.deleteAssignment(id);

    res.json({ success: true, message: 'Supplier assignment deleted successfully' });
  } catch (error) {
    console.error('Controller Error - deleteSupplierAssignment:', error);
    res.status(500).json({ message: 'Failed to delete supplier assignment', error: error.message });
  }
};

exports.getSupplierAssignmentById = async (req, res) => {
  const { id } = req.params;
  try {
    // Get the invoice row
    const [assignments] = await db.query(
      'SELECT * FROM supplier_assignments WHERE id = ?', [id]
    );
    if (!assignments.length) {
      return res.status(404).json({ error: 'Not found' });
    }
    // Get the items
    const [items] = await db.query(
      'SELECT * FROM supplier_assignment_items WHERE assignment_id = ?', [id]
    );
    res.json({ ...assignments[0], items });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};