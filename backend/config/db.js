// const mysql = require('mysql2/promise');
// const env = require('./env');

// let pool;

// async function createDBPool() {
//   try {
//     pool = mysql.createPool({
//       host: env.DB_HOST,
//       user: env.DB_USER,
//       password: env.DB_PASSWORD,
//       database: env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0
//     });

//     // Test connection
//     await pool.query('SELECT 1');
//     console.log(`✅ Connected to MySQL at ${env.DB_HOST}`);
//     return pool;
//   } catch (err) {
//     console.error('❌ DB Connection Failed:', err.message);
//     throw err;
//   }
// }

// // Initialize pool
// const getPool = async () => {
//   if (!pool) {
//     pool = await createDBPool();
//   }
//   return pool;
// };

// module.exports = {
//   query: async (...args) => {
//     const connection = await getPool();
//     return connection.query(...args);
//   },
//   getPool
// };

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const env = require('./env');

let pool;

async function createDBPool() {
  try {
    // Connect to MySQL *without* specifying a database first
    const rootPool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      multipleStatements: true,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Check if the database exists
    const [rows] = await rootPool.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [env.DB_NAME]
    );

    if (rows.length === 0) {
      console.log(`📦 Database '${env.DB_NAME}' not found. Creating from db.sql...`);
      const sqlPath = path.join(__dirname, 'db.sql');
      const schema = fs.readFileSync(sqlPath, 'utf8');
      await rootPool.query(schema);
      console.log(`✅ Database '${env.DB_NAME}' created.`);
    } else {
      console.log(`✅ Database '${env.DB_NAME}' already exists.`);
    }

    await rootPool.end(); // Close the root connection pool

    // Now create a pool using the database
    pool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    await pool.query('SELECT 1');
    console.log(`✅ Connected to '${env.DB_NAME}' at ${env.DB_HOST}`);
    return pool;
  } catch (err) {
    console.error('❌ DB Initialization Failed:', err.message);
    throw err;
  }
}

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
