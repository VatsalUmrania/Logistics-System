// clientModel.js
const db = require('../../../config/db');

const createClient = async (clientData) => {
  const [result] = await db.query(`INSERT INTO clients SET ?`, clientData);
  return result.insertId;
};

const getClients = async () => {
  const [rows] = await db.query(`SELECT * FROM clients`);
  return rows;
};

// const updateClients = async (id, clientsData) => {
//   const [result] = await db.query(
//     `UPDATE clients SET ? WHERE client_id = ?`,
//     [clientsData, id]
//   );
//   return result.affectedRows;
// };

const updateClients = async (clientId, clientsData) => {
  // Clean undefined values if needed
  const cleanData = {};
  for (const key in clientsData) {
    if (clientsData[key] !== undefined) {
      cleanData[key] = clientsData[key];
    }
  }
  const [result] = await db.query(
    `UPDATE clients SET ? WHERE client_id = ?`,
    [cleanData, clientId]
  );
  return result.affectedRows;
};

const deleteClients = async (clientId) => {
  const [result] = await db.query(
    `DELETE FROM clients WHERE client_id = ?`,
    [clientId]
  );
  return result.affectedRows;
};

const getClientById = async (clientId) => {
  const [rows] = await db.query(
    `SELECT * FROM clients WHERE client_id = ?`,
    [clientId]
  );
  return rows[0];
};

const updateClientByClientId = async (client_id, data) => {
  const [result] = await db.query(`UPDATE clients SET ? WHERE client_id = ?`, [data, client_id]);
  return result.affectedRows;
};

const deleteClientByClientId = async (client_id) => {
  const [result] = await db.query(`DELETE FROM clients WHERE client_id = ?`, [client_id]);
  return result.affectedRows;
};

