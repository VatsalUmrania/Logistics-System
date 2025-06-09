// const mysql = require('mysql2/promise');
// const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./env');

// const pool = mysql.createPool({
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// module.exports = pool;

const mysql = require('mysql2/promise');
const env = require('./env');

let pool;

async function createDBPool() {
  try {
    // Try connecting with current env values
    pool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log(`✅ Connected to MySQL at ${env.DB_HOST}`);
  } catch (err) {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1);
  }
}

createDBPool();

module.exports = {
  query: async (...args) => {
    if (!pool) throw new Error('Database not initialized');
    return pool.query(...args);
  },
  getPool: () => pool
};
