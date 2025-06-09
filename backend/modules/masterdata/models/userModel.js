// File: models/userModel.js
const db = require('../../../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const [result] = await db.query('INSERT INTO users SET ?', { ...user, password: hashedPassword });
  return result.insertId;
};

const getUser = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

const updateUser = async (id, user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [user, id]);
  return result.affectedRows;
};

const deleteUser = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser
};
