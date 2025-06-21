// controllers/operationsController.js
const Operations = require('../models//clearanceOperations');

exports.create = async (req, res) => {
  try {
    const newOperation = await Operations.create(req.body);
    res.status(201).json({ message: 'Operation created successfully', operation: newOperation });
  } catch (err) {
    res.status(500).json({ error: 'Error creating operation', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const operations = await Operations.getAll();
    res.json(operations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching operations', details: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const operation = await Operations.getById(req.params.id);
    if (!operation) return res.status(404).json({ error: 'Operation not found' });
    res.json(operation);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching operation', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedOperation = await Operations.update(req.params.id, req.body);
    res.json({ message: 'Operation updated successfully', operation: updatedOperation });
  } catch (err) {
    res.status(500).json({ error: 'Error updating operation', details: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Operations.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting operation', details: err.message });
  }
};
