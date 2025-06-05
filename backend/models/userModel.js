const db = require('../../config/db');

const createUser = async (userData) => {
  const [result] = await db.query(
    `INSERT INTO users SET ?`, 
    userDataData
  );
  return result.insertId;
};

const getUser = async () => {
  const [rows] = await db.query(`SELECT * FROM users`);
  return rows;
};


module.exports = { createUser, getUser };