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
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Optional: generate a token here using JWT if needed
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        employee_name: user.employee_name,
        email: user.email,
        is_admin: user.is_admin,
      },
      token: 'mock-token-or-jwt-if-implemented'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};