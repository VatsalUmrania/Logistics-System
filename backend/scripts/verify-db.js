require('dotenv').config();
const db = require('../config/db');

async function verifyDatabase() {
  try {
    console.log('Attempting database connection...');
    
    // Test connection
    const [result] = await db.query('SELECT 1 as test');
    console.log('Database connection successful:', result);

    // Check users table
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log('Number of users in database:', users[0].count);

    // Show sample users (without sensitive data)
    const [sampleUsers] = await db.query(
      'SELECT id, username, email, employee_name, is_admin FROM users LIMIT 5'
    );
    console.log('\nSample users:', sampleUsers);

  } catch (error) {
    console.error('Database verification failed:', error);
  } finally {
    process.exit();
  }
}

verifyDatabase();