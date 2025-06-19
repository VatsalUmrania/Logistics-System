// const db = require('../../config/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');


// // Generic create function
// const createRecord = async (table, data) => {
//   const [result] = await db.query(`INSERT INTO ${table} SET ?`, data);
//   return result.insertId;
// };

// // Generic get all function
// const getAllRecords = async (table) => {
//   const [rows] = await db.query(`SELECT * FROM ${table}`);
//   return rows;
// };

// // Generic update function
// const updateRecord = async (table, id, data, idField = 'id') => {
//   const [result] = await db.query(
//     `UPDATE ${table} SET ? WHERE ${idField} = ?`,
//     [data, id]
//   );
//   return result.affectedRows;
// };

// // Generic delete function
// const deleteRecord = async (table, id, idField = 'id') => {
//   const [result] = await db.query(
//     `DELETE FROM ${table} WHERE ${idField} = ?`,
//     [id]
//   );
//   return result.affectedRows;
// };

// // User-specific functions
// const getUserByEmail = async (email) => {
//   const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//   return rows;
// };

// const getUserById = async (id) => {
//   const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
//   return rows[0] || null; // Return single object instead of array
// };

// const loginUser = async (email, password) => {
//   try {
//     // First, check if user exists
//     const [users] = await db.query(
//       'SELECT * FROM users WHERE email = ? OR username = ?',
//       [email, email]
//     );

//     if (users.length === 0) return null;

//     const user = users[0];

//     // Compare passwords
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) return null;

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         is_admin: user.is_admin,
//         employee_name: user.employee_name
//       },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     // Remove password from response
//     const { password: _, ...userWithoutPassword } = user;

//     return {
//       ...userWithoutPassword,
//       token
//     };
//   } catch (error) {
//     console.error('Login error:', error);
//     throw error;
//   }
// };

// const createUser = async (data) => {
//   if (!data.password) throw new Error('Password is required');
  
//   const hashedPassword = await bcrypt.hash(data.password, 10);
//   const user = {
//     ...data,
//     password: hashedPassword,
//   };

//   return createRecord('users', user);
// };

// // Update user with password hashing
// const updateUser = async (id, data) => {
//   if (data.password) {
//     data.password = await bcrypt.hash(data.password, 10);
//   }
//   return updateRecord('users', id, data);
// };
// const blacklistToken = async (token) => {
//   await db.query('INSERT INTO blacklisted_tokens (token) VALUES (?)', [token]);
// };

// module.exports = {
//   loginUser,
//   createUser,
//   blacklistToken,
//   getUserByEmail,
//   getUserById,
//   updateUser,

//   // Banks
//   createBank: (data) => createRecord('banks', data),
//   getBanks: () => getAllRecords('banks'),
//   updateBank: (id, data) => updateRecord('banks', id, data),
//   deleteBank: (id) => deleteRecord('banks', id),

//   // Clients
//   createClient: (data) => createRecord('clients', data),
//   getClients: () => getAllRecords('clients'),
//   updateClientByClientId: (client_id, data) => updateRecord('clients', client_id, data, 'client_id'),
//   deleteClientByClientId: (client_id) => deleteRecord('clients', client_id, 'client_id'),

//   // Commodities
//   createCommodity: (data) => createRecord('commodities', data),
//   getCommodity: () => getAllRecords('commodities'),
//   updateCommodity: (id, data) => updateRecord('commodities', id, data),
//   deleteCommodity: (id) => deleteRecord('commodities', id),

//   // Categories
//   createCategory: (data) => createRecord('categories', data),
//   getCategory: () => getAllRecords('categories'),
//   updateCategory: (sino, data) => updateRecord('categories', sino, data),
//   deleteCategory: (sino) => deleteRecord('categories', sino),
//   getCategoryBySino: () => getAllRecords('categories'),

//   // Vessels
//   createVessel: (data) => createRecord('vessels', data),
//   getVessel: () => getAllRecords('vessels'),
//   updateVessel: (id, data) => updateRecord('vessels', id, data),
//   deleteVessel: (id) => deleteRecord('vessels', id),

//   // Containers
//   createContainer: (data) => createRecord('containers', data),
//   getContainer: () => getAllRecords('containers'),
//   updateContainer: (id, data) => updateRecord('containers', id, data),
//   deleteContainer: (id) => deleteRecord('containers', id),

//   // Ports
//   createPol: (data) => createRecord('ports', data),
//   getPol: () => getAllRecords('ports'),
//   updatePol: (id, data) => updateRecord('ports', id, data),
//   deletePol: (id) => deleteRecord('ports', id),

//   // Users
//   getUser: () => getAllRecords('users'),
//   deleteUser: (id) => deleteRecord('users', id)
// };


const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Generic get by id function
const getRecordById = async (table, id, idField = 'id') => {
  const [rows] = await db.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
  return rows[0] || null;
};

// Generic update function
const updateRecord = async (table, id, data, idField = 'id') => {
  const [result] = await db.query(
    `UPDATE ${table} SET ? WHERE ${idField} = ?`,
    [data, id]
  );
  return result.affectedRows;
};

// Generic delete function
const deleteRecord = async (table, id, idField = 'id') => {
  const [result] = await db.query(
    `DELETE FROM ${table} WHERE ${idField} = ?`,
    [id]
  );
  return result.affectedRows;
};

// User-specific functions
const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

const loginUser = async (email, password) => {
  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, email]
    );

    if (users.length === 0) return null;

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        employee_name: user.employee_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const createUser = async (data) => {
  if (!data.password) throw new Error('Password is required');
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = {
    ...data,
    password: hashedPassword,
  };
  return createRecord('users', user);
};

// Update user with password hashing
const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return updateRecord('users', id, data);
};

const blacklistToken = async (token) => {
  await db.query('INSERT INTO blacklisted_tokens (token) VALUES (?)', [token]);
};

module.exports = {
  loginUser,
  createUser,
  blacklistToken,
  getUserByEmail,
  getUserById,
  updateUser,

  // Banks
  createBank: (data) => createRecord('banks', data),
  getBanks: () => getAllRecords('banks'),
  updateBank: (id, data) => updateRecord('banks', id, data),
  deleteBank: (id) => deleteRecord('banks', id),

  // Clients
  createClient: (data) => createRecord('clients', data),
  getClients: () => getAllRecords('clients'),
  updateClientByClientId: (client_id, data) => updateRecord('clients', client_id, data, 'client_id'),
  deleteClientByClientId: (client_id) => deleteRecord('clients', client_id, 'client_id'),

  // Commodities
  createCommodity: (data) => createRecord('commodities', data),
  getCommodity: () => getAllRecords('commodities'),
  updateCommodity: (id, data) => updateRecord('commodities', id, data),
  deleteCommodity: (id) => deleteRecord('commodities', id),

  // Categories
  createCategory: (data) => createRecord('categories', data),
  getCategories: () => getAllRecords('categories'),
  getCategoryBySino: (sino) => getRecordById('categories', sino, 'sino'),
  updateCategory: (sino, data) => updateRecord('categories', sino, data, 'sino'),
  deleteCategory: (sino) => deleteRecord('categories', sino, 'sino'),

  // Vessels
  createVessel: (data) => createRecord('vessels', data),
  getVessel: () => getAllRecords('vessels'),
  updateVessel: (id, data) => updateRecord('vessels', id, data),
  deleteVessel: (id) => deleteRecord('vessels', id),

  // Containers
  createContainer: (data) => createRecord('containers', data),
  getContainer: () => getAllRecords('containers'),
  updateContainer: (id, data) => updateRecord('containers', id, data),
  deleteContainer: (id) => deleteRecord('containers', id),

  // Ports
  createPol: (data) => createRecord('ports', data),
  getPol: () => getAllRecords('ports'),
  updatePol: (id, data) => updateRecord('ports', id, data),
  deletePol: (id) => deleteRecord('ports', id),

  // Users
  getUser: () => getAllRecords('users'),
  deleteUser: (id) => deleteRecord('users', id)
};