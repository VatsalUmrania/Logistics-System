const db = require('../../config/db');

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


module.exports = { createBank, getAllBanks };