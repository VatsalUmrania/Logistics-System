const pool = require('../../../config/db');

async function getAllExpenses() {
  const [rows] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    ORDER BY e.created_at DESC
  `);
  return rows;
}

async function getExpenseById(id) {
  const [rows] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    WHERE e.id = ?
  `, [id]);
  return rows[0];
}

async function createExpense(expenseData) {
  const { operation_no, client_name, expense_item_id, actual_amount, vat_percent, vat_amount, date_of_payment } = expenseData;
  
  // Validate that the operation_no exists in invoices table
  const [invoiceCheck] = await pool.query('SELECT job_number FROM invoices WHERE job_number = ?', [operation_no]);
  if (invoiceCheck.length === 0) {
    throw new Error('Invalid operation number. Job number does not exist in invoices.');
  }

  // Validate that the expense_item_id exists
  const [itemCheck] = await pool.query('SELECT id FROM expense_items WHERE id = ?', [expense_item_id]);
  if (itemCheck.length === 0) {
    throw new Error('Invalid expense item ID. Expense item does not exist.');
  }

  const [result] = await pool.query(
    `INSERT INTO expenses (operation_no, client_name, expense_item_id, actual_amount, vat_percent, vat_amount, date_of_payment) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [operation_no, client_name, expense_item_id, actual_amount, vat_percent || 0, vat_amount || 0, date_of_payment]
  );

  // Return the created expense with expense item name
  const [createdExpense] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    WHERE e.id = ?
  `, [result.insertId]);

  return createdExpense[0];
}

async function updateExpense(id, expenseData) {
  const { operation_no, client_name, expense_item_id, actual_amount, vat_percent, vat_amount, date_of_payment } = expenseData;
  
  // Validate that the expense exists
  const [existingExpense] = await pool.query('SELECT id FROM expenses WHERE id = ?', [id]);
  if (existingExpense.length === 0) {
    throw new Error('Expense not found.');
  }

  // Validate that the operation_no exists in invoices table
  const [invoiceCheck] = await pool.query('SELECT job_number FROM invoices WHERE job_number = ?', [operation_no]);
  if (invoiceCheck.length === 0) {
    throw new Error('Invalid operation number. Job number does not exist in invoices.');
  }

  // Validate that the expense_item_id exists
  const [itemCheck] = await pool.query('SELECT id FROM expense_items WHERE id = ?', [expense_item_id]);
  if (itemCheck.length === 0) {
    throw new Error('Invalid expense item ID. Expense item does not exist.');
  }

  await pool.query(
    `UPDATE expenses 
     SET operation_no = ?, client_name = ?, expense_item_id = ?, actual_amount = ?, vat_percent = ?, vat_amount = ?, date_of_payment = ?
     WHERE id = ?`,
    [operation_no, client_name, expense_item_id, actual_amount, vat_percent || 0, vat_amount || 0, date_of_payment, id]
  );

  // Return the updated expense with expense item name
  const [updatedExpense] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    WHERE e.id = ?
  `, [id]);

  return updatedExpense[0];
}

async function deleteExpense(id) {
  // Check if expense exists
  const [existingExpense] = await pool.query('SELECT id FROM expenses WHERE id = ?', [id]);
  if (existingExpense.length === 0) {
    throw new Error('Expense not found.');
  }

  await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
  return { id };
}

// Additional helper functions
async function getExpensesByOperationNo(operation_no) {
  const [rows] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    WHERE e.operation_no = ?
    ORDER BY e.created_at DESC
  `, [operation_no]);
  return rows;
}

async function getExpensesByClient(client_name) {
  const [rows] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    WHERE e.client_name LIKE ?
    ORDER BY e.created_at DESC
  `, [`%${client_name}%`]);
  return rows;
}

async function getExpensesByDateRange(start_date, end_date) {
  const [rows] = await pool.query(`
    SELECT 
      e.*,
      ei.name as expense_item_name
    FROM expenses e
    LEFT JOIN expense_items ei ON e.expense_item_id = ei.id
    WHERE e.date_of_payment BETWEEN ? AND ?
    ORDER BY e.created_at DESC
  `, [start_date, end_date]);
  return rows;
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByOperationNo,
  getExpensesByClient,
  getExpensesByDateRange
};
