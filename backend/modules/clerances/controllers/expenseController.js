// controllers/expenseController.js
const expenseModel = require('../models/expenseModel');

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await expenseModel.getExpenseById(req.params.id);
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const newExpense = await expenseModel.createExpense(req.body);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await expenseModel.updateExpense(req.params.id, req.body);
    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await expenseModel.deleteExpense(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
