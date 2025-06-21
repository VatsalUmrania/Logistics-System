// controllers/billsController.js
const Bills = require('../models/bills');

exports.create = async (req, res) => {
  try {
    const newBill = await Bills.create(req.body);
    res.status(201).json({ message: 'Bill created successfully', bill: newBill });
  } catch (err) {
    res.status(500).json({ error: 'Error creating bill', details: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const bills = await Bills.getAll();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bills', details: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const bill = await Bills.getById(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bill', details: err.message });
  }
};

exports.getByOperationId = async (req, res) => {
  try {
    const bills = await Bills.getByOperationId(req.params.operation_id);
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bills', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedBill = await Bills.update(req.params.id, req.body);
    res.json({ message: 'Bill updated successfully', bill: updatedBill });
  } catch (err) {
    res.status(500).json({ error: 'Error updating bill', details: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Bills.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting bill', details: err.message });
  }
};
