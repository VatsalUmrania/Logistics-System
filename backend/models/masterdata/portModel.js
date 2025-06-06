const db = require('../../config/db');

const createPort = async (portData) => {
  const [result] = await db.query(
    `INSERT INTO ports SET ?`, 
    bankData
  );
  return result.insertId;
};

const getPort = async () => {
  const [rows] = await db.query(`SELECT * FROM baportsnks`);
  return rows;
};


module.exports = { createPort, getPort };