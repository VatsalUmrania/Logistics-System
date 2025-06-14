// const db = require('../../../config/db');

// exports.createAssignment = async (assignmentData) => {
//   const [result] = await db.query(
//     `INSERT INTO supplier_assignments 
//       (supplier_id, supplier_invoice_no, job_number, invoice_date, vat_rate, total_amount, vat_amount, bill_total_with_vat)
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       assignmentData.selectedSupplierId,
//       assignmentData.supplierInvoiceNo,
//       assignmentData.jobNumber,
//       assignmentData.invoiceDate,
//       assignmentData.vatRate,
//       assignmentData.totalAmount,
//       assignmentData.vatAmount,
//       assignmentData.billTotalWithVAT
//     ]
//   );
//   return result.insertId;
// };

// exports.createAssignmentItem = async (assignmentId, item) => {
//   await db.query(
//     `INSERT INTO supplier_assignment_items 
//       (assignment_id, purpose, item, quantity, amount)
//      VALUES (?, ?, ?, ?, ?)`,
//     [assignmentId, item.purpose, item.item, item.quantity, item.amount]
//   );
// };

// exports.getAssignmentWithItems = async (assignmentId) => {
//   const [rows] = await db.query(
//     `SELECT 
//       sa.*,
//       s.name AS supplier_name,
//       GROUP_CONCAT(
//         JSON_OBJECT(
//           'id', sai.id,
//           'purpose', sai.purpose,
//           'item', sai.item,
//           'quantity', sai.quantity,
//           'amount', sai.amount
//         )
//       ) AS items
//     FROM supplier_assignments sa
//     JOIN suppliers s ON sa.supplier_id = s.id
//     LEFT JOIN supplier_assignment_items sai ON sa.id = sai.assignment_id
//     WHERE sa.id = ?
//     GROUP BY sa.id`,
//     [assignmentId]
//   );
//   return rows[0];
// };

// exports.getLastInvoice = async () => {
//     const [rows] = await db.execute(
//       `SELECT supplier_invoice_no FROM supplier_assignments ORDER BY id DESC LIMIT 1`
//     );

//     return rows.length ? rows[0].supplier_invoice_no : null;
//   }

//   exports.getAllSupplierAssignments = async () => {
//     try {
//       const [rows] = await db.execute('SELECT * FROM supplier_assignments ORDER BY invoice_date DESC');
//       return rows;
//     } catch (error) {
//       console.error('Model Error - getAllSupplierAssignments:', error.message);
//       throw new Error('Database query failed');
//     }
//   }

const db = require('../../../config/db');

exports.createAssignment = async (assignmentData) => {
  const [result] = await db.query(
    `INSERT INTO supplier_assignments 
      (supplier_id, supplier_invoice_no, job_number, invoice_date, vat_rate, total_amount, vat_amount, bill_total_with_vat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      assignmentData.selectedSupplierId,
      assignmentData.supplierInvoiceNo,
      assignmentData.jobNumber,
      assignmentData.invoiceDate,
      assignmentData.vatRate,
      assignmentData.totalAmount,
      assignmentData.vatAmount,
      assignmentData.billTotalWithVAT
    ]
  );
  return result.insertId;
};

exports.createAssignmentItem = async (assignmentId, item) => {
  await db.query(
    `INSERT INTO supplier_assignment_items 
      (assignment_id, purpose, item, quantity, amount)
     VALUES (?, ?, ?, ?, ?)`,
    [assignmentId, item.purpose, item.item, item.quantity, item.amount]
  );
};

exports.getAssignmentWithItems = async (assignmentId) => {
  const [rows] = await db.query(
    `SELECT 
      sa.*,
      s.name AS supplier_name,
      GROUP_CONCAT(
        JSON_OBJECT(
          'id', sai.id,
          'purpose', sai.purpose,
          'item', sai.item,
          'quantity', sai.quantity,
          'amount', sai.amount
        )
      ) AS items
    FROM supplier_assignments sa
    JOIN suppliers s ON sa.supplier_id = s.id
    LEFT JOIN supplier_assignment_items sai ON sa.id = sai.assignment_id
    WHERE sa.id = ?
    GROUP BY sa.id`,
    [assignmentId]
  );
  return rows[0];
};

exports.getLastInvoice = async () => {
  const [rows] = await db.query(
    `SELECT supplier_invoice_no FROM supplier_assignments ORDER BY id DESC LIMIT 1`
  );

  return rows.length ? rows[0].supplier_invoice_no : null;
};

exports.getAllSupplierAssignments = async () => {
  try {
    const [rows] = await db.query(`
      SELECT 
        sa.*,
        s.name AS supplier_name
      FROM supplier_assignments sa
      LEFT JOIN suppliers s ON sa.supplier_id = s.id
      ORDER BY sa.invoice_date DESC
    `);
    return rows;
  } catch (error) {
    console.error('Model Error - getAllSupplierAssignments:', error.message);
    throw new Error(`Database query failed: ${error.message}`);
  }
};