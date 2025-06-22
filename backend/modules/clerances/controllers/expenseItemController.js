// controllers/expenseItemController.js
const expenseItemModel = require('../models/expenseItemModel');

exports.getAllExpenseItems = async (req, res) => {
  try {
    const expenseItems = await expenseItemModel.getAllExpenseItems();
    res.json(expenseItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseItemById = async (req, res) => {
  try {
    const expenseItem = await expenseItemModel.getExpenseItemById(req.params.id);
    if (expenseItem) {
      res.json(expenseItem);
    } else {
      res.status(404).json({ error: 'Expense item not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExpenseItem = async (req, res) => {
  try {
    const newExpenseItem = await expenseItemModel.createExpenseItem(req.body.name);
    res.status(201).json(newExpenseItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpenseItem = async (req, res) => {
  try {
    const updatedExpenseItem = await expenseItemModel.updateExpenseItem(req.params.id, req.body.name);
    res.json(updatedExpenseItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpenseItem = async (req, res) => {
  try {
    await expenseItemModel.deleteExpenseItem(req.params.id);
    res.json({ message: 'Expense item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
