const db = require('../../config/db');

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


module.exports = { createCategory, getCategory };