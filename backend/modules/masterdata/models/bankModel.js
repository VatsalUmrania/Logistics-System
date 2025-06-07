const db = require('../../../config/db');

const createBank = async (bankData) => {
  const [result] = await db.query(
    `INSERT INTO banks SET ?`, 
    bankData
  );
  return result.insertId;
};

const getAllBanks = async () => {
  const [rows] = await db.query(`SELECT * FROM banks`);
  return rows;
};

const updateBank = async (id, bankData) => {
  const [result] = await db.query(
    `UPDATE banks SET ? WHERE id = ?`,
    [bankData, id]
  );
  return result.affectedRows;
};

const deleteBank = async (id) => {
  const [result] = await db.query(
    `DELETE FROM banks WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  createBank,
  getAllBanks,
  updateBank,
  deleteBank,
};
