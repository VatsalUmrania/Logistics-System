const db = require('../../config/db');
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
const updateRecord = async (table, id, data, idField = 'id') => {
  const [result] = await db.query(
    `UPDATE ${table} SET ? WHERE ${idField} = ?`,
    [data, id]
  );
  return result.affectedRows;
};

// Generic delete function with dynamic ID field
const deleteRecord = async (table, id, idField = 'id') => {
  const [result] = await db.query(
    `DELETE FROM ${table} WHERE ${idField} = ?`,
    [id]
  );
  return result.affectedRows;
};

const loginUser = async (email, password) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  if (rows.length === 0) return null;

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  // Return safe user object (no password)
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    employee_name: user.employee_name,
    is_admin: user.is_admin
  };
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows;
};

const updateClientByClientId = async (client_id, data) => {
  const [result] = await db.query(`UPDATE clients SET ? WHERE client_id = ?`, [data, client_id]);
  return result.affectedRows;
};

const deleteClientByClientId = async (client_id) => {
  const [result] = await db.query(`DELETE FROM clients WHERE client_id = ?`, [client_id]);
  return result.affectedRows;
};


module.exports = {
  loginUser,
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
  updateClientByClientId,
  deleteClientByClientId,
  // Commodities
  createCommodity: (data) => createRecord('commodities', data),
  getCommodity: () => getAllRecords('commodities'), 
  updateCommodity: (id,data) => updateRecord('commodities',id,data),
  deleteCommodity: (id) => deleteRecord('commodities',id),
  // Categories
  createCategory: (data) => createRecord('categories', data),
  getCategory: () => getAllRecords('categories'),
  updateCategory: (sino, data) => updateRecord('categories', sino, data, 'sino'),
  deleteCategory: (sino) => deleteRecord('categories', sino, 'sino'),
  updateClientByClientId: (client_id, data) => updateRecord('clients', client_id, data, 'client_id'),
  deleteClientByClientId: (client_id) => deleteRecord('clients', client_id, 'client_id'),

  // Vessels
  createVessel: (data) => createRecord('vessels', data),
  getVessel: () => getAllRecords('vessels'),
  updateVessel: (id,data) => updateRecord('vessels',id,data),
  deleteVessel: (id) => deleteRecord('vessels',id),
  // Containers
  createContainer: (data) => createRecord('containers', data),
  getContainer: () => getAllRecords('containers'),
  updateContainer: (id, data) => updateRecord('containers', id, data),
  deleteContainer: (id) => deleteRecord('containers', id),
  // Ports
  createPol: (data) => createRecord('ports', data),
  getPol: () => getAllRecords('ports'),
  updatePol: (id,data) => updateRecord('ports', id , data),
  deletePol: (id) => deleteRecord('ports', id),

  // Users
  createUser: (data) => createRecord('users', data),
  getUser: () => getAllRecords('users'),
  updateUser: (id,data) => updateRecord('users',id ,data),
  deleteUser: (id) => deleteRecord('users', id)
};
