require('dotenv').config();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    console.log('Starting test user creation...');

    // Hash password
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create test user
    const [result] = await db.query(`
      INSERT INTO users (
        employee_name,
        username,
        email,
        password,
        nationality,
        passport_no,
        address,
        phone_no,
        license_no,
        is_admin,
        is_protected
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Test User',
      'testuser',
      'test@example.com',
      hashedPassword,
      'Indian',
      'TEST123456',
      'Test Address',
      '1234567890',
      'LIC123456',
      0,
      0
    ]);

    console.log('Test user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Username: testuser');
    console.log('Email: test@example.com');
    console.log('Password:', password);

    // Verify user was created
    const [user] = await db.query(
      'SELECT id, username, email, is_admin FROM users WHERE id = ?',
      [result.insertId]
    );
    console.log('\nCreated user details:', user[0]);

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('Test user already exists. Updating password...');
      
      const hashedPassword = await bcrypt.hash('test123', 10);
      await db.query(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, 'testuser']
      );
      
      console.log('Password updated successfully!');
    } else {
      console.error('Error:', error);
    }
  } finally {
    process.exit();
  }
}

createTestUser();