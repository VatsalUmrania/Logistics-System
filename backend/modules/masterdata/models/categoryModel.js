const db = require('../../../config/db');

// Create a new category
const createCategory = async (code, name) => {
  const [result] = await db.query(
    `INSERT INTO categories (code, name) VALUES (?, ?)`,
    [code, name]
  );
  return result.insertId;
};

const getCategory = async () => {
  const [rows] = await db.query(`SELECT * FROM categories`);
  return rows;
};

const getCategoryById = async (sino) => {
  const [rows] = await db.query(`SELECT * FROM categories WHERE sino = ?`, [sino]);
  return rows[0]; // Return only the first record or undefined
};

const updateCategory = async (sino, code, name) => {
  const [result] = await db.query(
    `UPDATE categories SET code = ?, name = ? WHERE sino = ?`,
    [code, name, sino]
  );
  return result.affectedRows; // Returns the number of rows affected (1 if updated)
};

// Delete a category by ID
const deleteCategory = async (sino) => {
  const [result] = await db.query(
    `DELETE FROM categories WHERE sino = ?`,
    [sino]
  );
  return result.affectedRows; // Returns the number of rows deleted (1 if deleted)
};

module.exports = { 
  createCategory, 
  getCategory, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
};
