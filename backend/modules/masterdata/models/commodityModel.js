const db = require('../../../config/db');

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

const updateCommodity = async (id, commodities) => {
  const [result] = await db.query('UPDATE commodities SET ? WHERE id = ?', [commodities, id]);
  return result.affectedRows;
};

const deleteCommodity = async (id) => {
  const [result] = await db.query('DELETE FROM commodities WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { createCommodity ,getCommodity, updateCommodity, deleteCommodity};