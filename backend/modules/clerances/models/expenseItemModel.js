// models/expenseItemModel.js
const pool = require('../../../config/db');

async function getAllExpenseItems() {
  const [rows] = await pool.query('SELECT * FROM expense_items');
  return rows;
}

async function getExpenseItemById(id) {
  const [rows] = await pool.query('SELECT * FROM expense_items WHERE id = ?', [id]);
  return rows[0];
}

async function createExpenseItem(name) {
  const [result] = await pool.query('INSERT INTO expense_items (name) VALUES (?)', [name]);
  return { id: result.insertId, name };
}

async function updateExpenseItem(id, name) {
  await pool.query('UPDATE expense_items SET name = ? WHERE id = ?', [name, id]);
  return { id, name };
}

async function deleteExpenseItem(id) {
  await pool.query('DELETE FROM expense_items WHERE id = ?', [id]);
  return { id };
}

module.exports = {
  getAllExpenseItems,
  getExpenseItemById,
  createExpenseItem,
  updateExpenseItem,
  deleteExpenseItem
};
