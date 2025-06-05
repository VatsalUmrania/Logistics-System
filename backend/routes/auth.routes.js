// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const db = require('../config/database');

// const register = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // Check if user already exists
//     const [existingUsers] = await db.query(
//       'SELECT * FROM users WHERE username = ? OR email = ?',
//       [username, email]
//     );

//     if (existingUsers.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert new user
//     const [result] = await db.query(
//       'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
//       [username, email, hashedPassword, role]
//     );

//     // Create JWT token
//     const token = jwt.sign(
//       { id: result.insertId, username, role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const [users] = await db.query(
//       'SELECT * FROM users WHERE email = ?',
//       [email]
//     );

//     if (users.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const user = users[0];

//     // Verify password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { id: user.id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     res.json({
//       message: 'Logged in successfully',
//       token
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   register,
//   login
// };

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);

module.exports = router;