const mysql = require('mysql2/promise');
const env = require('./env');

let pool;

async function createDBPool() {
  try {
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
    return pool;
  } catch (err) {
    console.error('❌ DB Connection Failed:', err.message);
    throw err;
  }
}

// Initialize pool
const getPool = async () => {
  if (!pool) {
    pool = await createDBPool();
  }
  return pool;
};

module.exports = {
  query: async (...args) => {
    const connection = await getPool();
    return connection.query(...args);
  },
  getPool
};