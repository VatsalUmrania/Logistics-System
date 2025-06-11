// File: controllers/userController.js
const model = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const id = await model.createUser(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await model.getUser();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await model.updateUser(id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await model.deleteUser(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await model.loginUser(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      ...result
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required for logout' });
  }

  try {
    // Add the token to the blacklist (if you're using token blacklisting)
    await model.logoutUser(token);

    // Respond with success message
    res.json({ success: true, message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};