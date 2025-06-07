// File: models/containerModel.js
const db = require('../../../config/db');

// Create a new container
const createContainer = async (containerData) => {
  const [result] = await db.query(`INSERT INTO containers SET ?`, containerData);
  return result.insertId;
};

// Get all containers
const getContainer = async () => {
  const [rows] = await db.query(`SELECT * FROM containers`);
  return rows;
};

// Update a container by ID
const updateContainer = async (id, containerData) => {
  const [result] = await db.query(`UPDATE containers SET ? WHERE id = ?`, [containerData, id]);
  return result.affectedRows;
};

// Delete a container by ID
const deleteContainer = async (id) => {
  const [result] = await db.query(`DELETE FROM containers WHERE id = ?`, [id]);
  return result.affectedRows;
};

module.exports = {
  createContainer,
  getContainer,
  updateContainer,
  deleteContainer
};
