// File: controllers/containerController.js
const containerModel = require('../models/containerModel');

// Create a new container
exports.createContainer = async (req, res) => {
  try {
    const containerId = await containerModel.createContainer(req.body);
    res.status(201).json({ id: containerId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all containers
exports.getContainer = async (req, res) => {
  try {
    const containers = await containerModel.getContainer();
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a container by ID
exports.updateContainer = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await containerModel.updateContainer(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Container not found' });
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a container by ID
exports.deleteContainer = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await containerModel.deleteContainer(id);
    if (!deleted) return res.status(404).json({ error: 'Container not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
