const containerModel = require('../models/containerModel');

exports.createContainer = async (req, res) => {
  try {
    const Container_id = await containerModel.createContainer(req.body);
    res.status(201).json({ id: Container_id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContainer = async (req, res) => {
  try {
    const container = await containerModel.getContainer();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};