const db = require('../../../config/db');

// Create a new category
const createCategory = async (code, name) => {
  const [result] = await db.query(
    `INSERT INTO categories (code, name) VALUES (?, ?)`,
    [code, name]
  );
  return result.insertId;
};

// Get all categories
// In your category model (e.g., `categoryModel.js`)
const getCategory = async () => {
  const [rows] = await db.query(`SELECT * FROM categories`);
  return rows;
};





// Update an existing category
const updateCategory = async (id, code, name) => {
  const [result] = await db.query(
    `UPDATE categories SET code = ?, name = ? WHERE id = ?`,
    [code, name, id]
  );
  return result.affectedRows; // Returns the number of rows affected (1 if updated)
};

// Delete a category by ID
const deleteCategory = async (id) => {
  const [result] = await db.query(
    `DELETE FROM categories WHERE id = ?`,
    [id]
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
