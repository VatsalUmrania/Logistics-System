const db = require('../../config/db');

const createCommodity = async (name, categoryId) => {
  const [result] = await db.query(
    `INSERT INTO commodities (name, category_id) VALUES (?, ?)`,
    [name, categoryId]
  );
  return result.insertId;
};

const getCommodity = async () => {
  const [rows] = await db.query(`SELECT * FROM commodities`);
  return rows;
};

module.exports = { createCommodity ,getCommodity};