// const mysql = require('mysql2/promise');
// const fs = require('fs');
// const path = require('path');
// const env = require('./env');

// let pool;

// async function createDBPool() {
//   try {
//     // Connect without specifying database
//     const rootPool = mysql.createPool({
//       host: env.DB_HOST,
//       user: env.DB_USER,
//       password: env.DB_PASSWORD,
//       multipleStatements: true,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });

//     // Check if database exists
//     const [rows] = await rootPool.query(
//       `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
//       [env.DB_NAME]
//     );

//     if (rows.length === 0) {
//       console.log(`📦 Database '${env.DB_NAME}' not found. Creating from db.sql...`);
//       const sqlPath = path.join(__dirname, 'db.sql');
//       const schema = fs.readFileSync(sqlPath, 'utf8');
//       await rootPool.query(schema);
//       console.log(`✅ Database '${env.DB_NAME}' created.`);
//     } else {
//       console.log(`✅ Database '${env.DB_NAME}' already exists.`);
//     }

//     await rootPool.end(); // Close rootPool

//     // Create pool with database specified
//     pool = mysql.createPool({
//       host: env.DB_HOST,
//       user: env.DB_USER,
//       password: env.DB_PASSWORD,
//       database: env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });

//     // Test connection
//     await pool.query('SELECT 1');
//     console.log(`✅ Connected to '${env.DB_NAME}' at ${env.DB_HOST}`);

//     return pool;
//   } catch (err) {
//     console.error('❌ DB Initialization Failed:', err.message);
//     throw err;
//   }
// }

// async function getPool() {
//   if (!pool) {
//     pool = await createDBPool();
//   }
//   return pool;
// }

// module.exports = {
//   query: async (...args) => {
//     const pool = await getPool();
//     return pool.query(...args);
//   },
//   getConnection: async () => {
//     const pool = await getPool();
//     return pool.getConnection();
//   }
// };


// const mysql = require('mysql2/promise');
// const fs = require('fs');
// const path = require('path');
// const env = require('./env');

// let pool;

// async function createDBPool() {
//   try {
//     // Connect without specifying the database
//     const rootPool = mysql.createPool({
//       host: env.DB_HOST,
//       user: env.DB_USER,
//       password: env.DB_PASSWORD,
//       multipleStatements: true,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });

//     // Check if the database exists
//     const [rows] = await rootPool.query(
//       `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
//       [env.DB_NAME]
//     );

//     if (rows.length === 0) {
//       console.log(`📦 Database '${env.DB_NAME}' not found. Creating from db.sql...`);
//       const sqlPath = path.join(__dirname, 'db.sql');
//       const schema = fs.readFileSync(sqlPath, 'utf8');
//       await rootPool.query(schema);
//       console.log(`✅ Database '${env.DB_NAME}' created.`);
//     } else {
//       console.log(`✅ Database '${env.DB_NAME}' already exists.`);
//     }

//     await rootPool.end(); // Close rootPool

//     // Create pool with the database specified
//     pool = mysql.createPool({
//       host: env.DB_HOST,
//       user: env.DB_USER,
//       password: env.DB_PASSWORD,
//       database: env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });

//     // Test the connection
//     await pool.query('SELECT 1');
//     console.log(`✅ Connected to '${env.DB_NAME}' at ${env.DB_HOST}`);

//     return pool;
//   } catch (err) {
//     console.error('❌ DB Initialization Failed:', err.message);
//     throw err;
//   }
// }

// async function getPool() {
//   if (!pool) {
//     pool = await createDBPool();
//   }
//   return pool;
// }

// module.exports = {
//   getPool,
//   query: async (...args) => {
//     const pool = await getPool();
//     return pool.query(...args);
//   },
//   getConnection: async () => {
//     const pool = await getPool();
//     return pool.getConnection();
//   }
// };


const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const env = require('./env');

let pool;

async function createDBPool() {
  try {
    // Connect without specifying the database
    const rootPool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      multipleStatements: true,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Check if the database exists
    const [rows] = await rootPool.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [env.DB_NAME]
    );

    if (rows.length === 0) {
      console.log(`📦 Database '${env.DB_NAME}' not found. Creating from db.sql...`);

      const sqlPath = path.join(__dirname, 'db.sql');
      if (!fs.existsSync(sqlPath)) {
        console.error('❌ db.sql file not found!');
        throw new Error('Missing db.sql file');
      }

      const schema = fs.readFileSync(sqlPath, 'utf8');
      await rootPool.query(schema);
      console.log(`✅ Database '${env.DB_NAME}' created.`);
    } else {
      console.log(`✅ Database '${env.DB_NAME}' already exists.`);
    }

    await rootPool.end(); // Close rootPool

    // Create pool with the database specified
    pool = mysql.createPool({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    await pool.query('SELECT 1');
    console.log(`✅ Connected to '${env.DB_NAME}' at ${env.DB_HOST}`);

    return pool;
  } catch (err) {
    console.error('❌ DB Initialization Failed:', err);  // Log full error
    throw err;
  }
}

async function getPool() {
  try {
    if (!pool) {
      pool = await createDBPool();
    }
    return pool;
  } catch (err) {
    console.error('❌ Failed to initialize the database pool:', err.message);
    throw err;
  }
}

module.exports = {
  getPool,
  query: async (...args) => {
    const pool = await getPool();
    return pool.query(...args);
  },
  getConnection: async () => {
    const pool = await getPool();
    return pool.getConnection();
  }
};

// Gracefully close the DB pool on app shutdown
process.on('SIGINT', async () => {
  console.log('Closing DB pool...');
  if (pool) {
    await pool.end();
    console.log('DB pool closed');
  }
  process.exit(0);
});
