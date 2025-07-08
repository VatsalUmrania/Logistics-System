const db = require('../../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (user) => {
    // Validate required fields
    if (!user.email || !user.password || !user.employee_name) {
        throw new Error('Missing required fields');
    }

    // Check if user already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [user.email]);
    if (existing.length > 0) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await db.query(
        'INSERT INTO users (email, password, employee_name, is_admin) VALUES (?, ?, ?, ?)', 
        [user.email, hashedPassword, user.employee_name, user.is_admin || false]
    );
    return result.insertId;
};

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            employee_name: user.employee_name,
            is_admin: user.is_admin 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    

    return {
        user: {
            id: user.id,
            email: user.email,
            employee_name: user.employee_name,
            is_admin: user.is_admin,
            
        },
        token
    };
};

const updateUser = async (id, userData) => {
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [userData, id]);
    return result.affectedRows;
};

const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
};

const getUsers = async () => {
    const [rows] = await db.query('SELECT id, email, employee_name, is_admin FROM users');
    return rows;
};

const blacklistToken = async (token) => {
    // Check if token is already blacklisted
    const [existing] = await db.query('SELECT * FROM blacklist_tokens WHERE token = ?', [token]);
    if (existing.length > 0) {
        throw new Error('Token already blacklisted');
    }
    
    // Add the token to blacklist
    await db.query('INSERT INTO blacklist_tokens (token) VALUES (?)', [token]);
};

// Verify token is not blacklisted
const isTokenBlacklisted = async (token) => {
    const [rows] = await db.query('SELECT * FROM blacklist_tokens WHERE token = ?', [token]);
    return rows.length > 0; // Returns true if token is blacklisted
};

// When the user logs out, add token to blacklist
const logoutUser = async (token) => {
    await blacklistToken(token);
};

const getUserById = async (id) => {
    const [rows] = await db.query('SELECT id, email, employee_name, is_admin, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0]; // Return the user details, or undefined if no user is found
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUsers,
    isTokenBlacklisted,
    logoutUser,
    getUserById
};