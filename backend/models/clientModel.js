// clientModel.js
const db = require('../../config/db');

const createClient = async (clientData) => {
  const [result] = await db.query(`INSERT INTO clients SET ?`, clientData);
  return result.insertId;
};

const getClients = async () => {
  const [rows] = await db.query(`SELECT * FROM clients`);
  return rows;
};

const updateClients = async (id, clientsData) => {
  const [result] = await db.query(
    `UPDATE clients SET ? WHERE id = ?`,
    [clientsData, id]
  );
  return result.affectedRows;
};

const deleteClients = async (id) => {
  const [result] = await db.query(
    `DELETE FROM clients WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};
module.exports = { createClient, getClients, updateClients, deleteClients };
