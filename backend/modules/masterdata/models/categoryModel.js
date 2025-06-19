const db = require('../db');

// CREATE
async function createCategory({ code, name, status = 'Active' }) {
  const [result] = await db.query(
    'INSERT INTO categories (code, name, status) VALUES (?, ?, ?)',
    [code, name, status]
  );
  return { sino: result.insertId, code, name, status };
}

// READ ALL
async function getAllCategories() {
  const [rows] = await db.query('SELECT * FROM categories');
  return rows;
}

// READ ONE
async function getCategoryById(sino) {
  const [rows] = await db.query('SELECT * FROM categories WHERE sino = ?', [sino]);
  return rows[0] || null;
}

// UPDATE
async function updateCategory(sino, { code, name, status }) {
  const [result] = await db.query(
    'UPDATE categories SET code = ?, name = ?, status = ? WHERE sino = ?',
    [code, name, status, sino]
  );
  return result.affectedRows > 0;
}

// DELETE
async function deleteCategory(sino) {
  const [result] = await db.query('DELETE FROM categories WHERE sino = ?', [sino]);
  return result.affectedRows > 0;
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};