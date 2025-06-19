const db = require('../../../config/db');

const createVessel = async (VesselData) => {
  const [result] = await db.query(`INSERT INTO vessels SET ?`, VesselData);
  return result.insertId;
};

const getVessel = async () => {
  const [rows] = await db.query(`SELECT * FROM vessels`);
  return rows;
};

const updateVessel = async (id, vessel) => {
  const [result] = await db.query('UPDATE vessels SET ? WHERE id = ?', [vessel, id]);
  return result.affectedRows;
};

const deleteVessel = async (id) => {
  const [result] = await db.query('DELETE FROM vessels WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { createVessel, getVessel, updateVessel, deleteVessel };
