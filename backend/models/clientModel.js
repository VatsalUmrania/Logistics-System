const db = require('../../config/db');

const createClient = async (clientData) => {
  const [result] = await db.query(
    `INSERT INTO clients SET ?`,
    clientData
  );
  return result.insertId;
};


const getClients = async () => {
  const [rows] = await db.query(`SELECT * FROM clients`);
  return rows;
};
module.exports = { createClient, getClients };