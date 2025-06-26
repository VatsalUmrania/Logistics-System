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
//       if (!fs.existsSync(sqlPath)) {
//         console.error('❌ db.sql file not found!');
//         throw new Error('Missing db.sql file');
//       }

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
//     console.error('❌ DB Initialization Failed:', err);
//     throw err;
//   }
// }

// async function getPool() {
//   try {
//     if (!pool) {
//       pool = await createDBPool();
//     }
//     return pool;
//   } catch (err) {
//     console.error('❌ Failed to initialize the database pool:', err.message);
//     throw err;
//   }
// }

// module.exports = {
//   getPool,
//   query: async (...args) => {
//     const pool = await getPool();
//     return pool.query(...args);
//   },
//   execute: async (...args) => {
//     const pool = await getPool();
//     return pool.execute(...args);
//   },
//   getConnection: async () => {
//     const pool = await getPool();
//     return pool.getConnection();
//   }
// };

// // Gracefully close the DB pool on app shutdown
// process.on('SIGINT', async () => {
//   console.log('Closing DB pool...');
//   if (pool) {
//     await pool.end();
//     console.log('DB pool closed');
//   }
//   process.exit(0);
// });


const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const env = require('./env');

let pool;

async function createDBPool() {
  try {
    // For Railway, use DATABASE_URL if available, otherwise fall back to individual env vars
    if (process.env.DATABASE_URL) {
      // Parse Railway's DATABASE_URL
      const dbUrl = new URL(process.env.DATABASE_URL);
      
      pool = mysql.createPool({
        host: dbUrl.hostname,
        port: dbUrl.port || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1), // Remove leading '/'
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
    } else {
      // Local development fallback
      pool = mysql.createPool({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    // Test the connection
    await pool.query('SELECT 1');
    console.log(`✅ Connected to database`);

    // Initialize schema if needed (only for local development)
    if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
      await initializeSchema();
    }

    return pool;
  } catch (err) {
    console.error('❌ DB Initialization Failed:', err);
    throw err;
  }
}

async function initializeSchema() {
  try {
    // Check if tables exist
    const [tables] = await pool.query("SHOW TABLES");
    
    if (tables.length === 0) {
      console.log(`📦 Database empty. Creating from db.sql...`);
      
      const sqlPath = path.join(__dirname, 'db.sql');
      if (fs.existsSync(sqlPath)) {
        const schema = fs.readFileSync(sqlPath, 'utf8');
        await pool.query(schema);
        console.log(`✅ Database schema created.`);
      }
    }
  } catch (err) {
    console.error('❌ Schema initialization failed:', err);
  }
}

// Rest of your code remains the same
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
  execute: async (...args) => {
    const pool = await getPool();
    return pool.execute(...args);
  },
  getConnection: async () => {
    const pool = await getPool();
    return pool.getConnection();
  }
};

process.on('SIGINT', async () => {
  console.log('Closing DB pool...');
  if (pool) {
    await pool.end();
    console.log('DB pool closed');
  }
  process.exit(0);
});
