const db = require('../../config/db');

const createContainer = async (containerData) => {
  const [result] = await db.query(
    `INSERT INTO containers SET ?`, 
    containerData
  );
  return result.insertId;
};

const getContainer = async () => {
  const [rows] = await db.query(`SELECT * FROM containers`);
  return rows;
};


module.exports = { createContainer, getContainer };