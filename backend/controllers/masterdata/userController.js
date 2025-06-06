const userModel = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const UserId = await userModel.createUser(req.body);
    res.status(201).json({ id: UserId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await userModel.getUser();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};