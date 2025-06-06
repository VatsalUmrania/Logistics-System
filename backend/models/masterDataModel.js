const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Generic create function
const createRecord = async (table, data) => {
  const [result] = await db.query(`INSERT INTO ${table} SET ?`, data);
  return result.insertId;
};

// Generic get all function
const getAllRecords = async (table) => {
  const [rows] = await db.query(`SELECT * FROM ${table}`);
  return rows;
};

// Generic update function
const updateRecord = async (table, id, data) => {
  const [result] = await db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
  return result.affectedRows;
};

// Generic delete function
const deleteRecord = async (table, id) => {
  const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  return result.affectedRows;
};

// User functions (with password hash)
const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const newUser = { ...userData, password: hashedPassword };
  const [result] = await db.query('INSERT INTO users SET ?', newUser);
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows;
};

module.exports = {
  getUserByEmail,
  getUserById,

  // Banks
  createBank: (data) => createRecord('banks', data),
  getBanks: () => getAllRecords('banks'),
  updateBank: (id, data) => updateRecord('banks', id, data),
  deleteBank: (id) => deleteRecord('banks', id),

  // Clients
  createClient: (data) => createRecord('clients', data),
  getClients: () => getAllRecords('clients'),
  updateClient: (client_id, data) => updateRecord('clients', client_id, data),
  deleteClient: (client_id) => deleteRecord('clients', client_id),
  // Commodities
  createCommodity: (data) => createRecord('commodities', data),
  getCommodity: () => getAllRecords('commodities'), 

  // Categories
  createCategory: (data) => createRecord('categories', data),
  getCategory: () => getAllRecords('categories'),

  // Vessels
  createVessel: (data) => createRecord('vessels', data),
  getVessel: () => getAllRecords('vessels'),

  // Containers
  createContainer: (data) => getAllRecords('containers'),
  getContainer: (data) => getAllRecords('containers'),

  // Ports
  createPort: (data) => createRecord('ports', data),
  getPort: (data) => getAllRecords('ports'),

  // Users
  createUser: (data) => createRecord('users', data),
  getUser: (data) => getAllRecords('users'),
};
