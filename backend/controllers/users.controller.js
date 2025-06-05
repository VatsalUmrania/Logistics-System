// const db = require('../config/database');

// const getProfile = async (req, res) => {
//   try {
//     const [users] = await db.query(
//       'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
//       [req.user.id]
//     );

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(users[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const updateProfile = async (req, res) => {
//   try {
//     const { username, email } = req.body;

//     await db.query(
//       'UPDATE users SET username = ?, email = ? WHERE id = ?',
//       [username, email, req.user.id]
//     );

//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const [users] = await db.query(
//       'SELECT id, username, email, role, created_at FROM users'
//     );
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const [users] = await db.query(
//       'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
//       [req.params.id]
//     );

//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(users[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const [result] = await db.query(
//       'DELETE FROM users WHERE id = ?',
//       [req.params.id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getProfile,
//   updateProfile,
//   getAllUsers,
//   getUserById,
//   deleteUser
// };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT id, employeeName, username, nationality, 
            passportIqama, address, phone, licenseNo 
            FROM users
        `);
        res.json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const {
            employeeName,
            username,
            password,
            nationality,
            passportIqama,
            address,
            phone,
            licenseNo
        } = req.body;

        // Validate required fields
        if (!employeeName || !username || !password) {
            return res.status(400).json({ 
                message: 'Employee name, username and password are required' 
            });
        }

        // Check if username already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                message: 'Username already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await db.query(`
            INSERT INTO users (
                employeeName, username, password, nationality,
                passportIqama, address, phone, licenseNo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            employeeName,
            username,
            hashedPassword,
            nationality,
            passportIqama,
            address,
            phone,
            licenseNo
        ]);

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            employeeName,
            username,
            password,
            nationality,
            passportIqama,
            address,
            phone,
            licenseNo
        } = req.body;

        // Check if user exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If password is being updated, hash it
        let hashedPassword = existingUsers[0].password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Update user
        await db.query(`
            UPDATE users 
            SET employeeName = ?, username = ?, password = ?, 
                nationality = ?, passportIqama = ?, address = ?,
                phone = ?, licenseNo = ?
            WHERE id = ?
        `, [
            employeeName,
            username,
            hashedPassword,
            nationality,
            passportIqama,
            address,
            phone,
            licenseNo,
            id
        ]);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};