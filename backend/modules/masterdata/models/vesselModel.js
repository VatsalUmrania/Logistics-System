const db = require('../../../config/db');

const createVesssl = async (VesselData) => {
  const [result] = await db.query(
    `INSERT INTO vessels SET ?`, 
    VesselData
  );
  return result.insertId;
};

const getVessl = async () => {
  const [rows] = await db.query(`SELECT * FROM vessels`);
  return rows;
};


module.exports = { createBank, getAllBanks };