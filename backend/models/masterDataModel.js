const db = require('../config/db');


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

module.exports = {
  // Banks
  createBank: (data) => createRecord('banks', data),
  getBanks: () => getAllRecords('banks'),
  
  // Clients
  createClient: (data) => createRecord('clients', data),
  getClients: () => getAllRecords('clients'),
  
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
  createContainer: (data) => createRecord('containers', data),
  getContainer: (data) => getAllRecords('containers'),
  // Ports
  createPort: (data) => createRecord('ports', data),
  getPort: (data) => getAllRecords('ports'),
  // Users
  createUser: (data) => createRecord('users', data),
  getUser: (data) => getAllRecords('users')
};
