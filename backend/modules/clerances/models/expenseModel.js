// models/expenseModel.js
const pool = require('../../../config/db');

async function getAllExpenses() {
  const [rows] = await pool.query('SELECT * FROM expenses');
  return rows;
}

async function getExpenseById(id) {
  const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);
  return rows[0];
}

async function createExpense(expenseData) {
  const { operation_no, client_name, expense_item, actual_amount, vat_percent, vat_amount, date_of_payment } = expenseData;
  const [result] = await pool.query(
    'INSERT INTO expenses (operation_no, client_name, expense_item, actual_amount, vat_percent, vat_amount, date_of_payment) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [operation_no, client_name, expense_item, actual_amount, vat_percent, vat_amount, date_of_payment]
  );
  return { id: result.insertId, ...expenseData };
}

async function updateExpense(id, expenseData) {
  const { operation_no, client_name, expense_item, actual_amount, vat_percent, vat_amount, date_of_payment } = expenseData;
  await pool.query(
    'UPDATE expenses SET operation_no = ?, client_name = ?, expense_item = ?, actual_amount = ?, vat_percent = ?, vat_amount = ?, date_of_payment = ? WHERE id = ?',
    [operation_no, client_name, expense_item, actual_amount, vat_percent, vat_amount, date_of_payment, id]
  );
  return { id, ...expenseData };
}

async function deleteExpense(id) {
  await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
  return { id };
}

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
