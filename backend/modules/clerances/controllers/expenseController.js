const expenseModel = require('../models/expenseModel');

exports.getAllExpenses = async (req, res) => {
  try {
    const { operation_no, client_name, start_date, end_date } = req.query;
    
    let expenses;
    
    if (operation_no) {
      expenses = await expenseModel.getExpensesByOperationNo(operation_no);
    } else if (client_name) {
      expenses = await expenseModel.getExpensesByClient(client_name);
    } else if (start_date && end_date) {
      expenses = await expenseModel.getExpensesByDateRange(start_date, end_date);
    } else {
      expenses = await expenseModel.getAllExpenses();
    }
    
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
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
    console.error('Error fetching expense by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    // Validate required fields
    const { operation_no, client_name, expense_item_id, actual_amount } = req.body;
    
    if (!operation_no || !client_name || !expense_item_id || !actual_amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: operation_no, client_name, expense_item_id, actual_amount' 
      });
    }

    // Validate numeric fields
    if (isNaN(parseFloat(actual_amount)) || parseFloat(actual_amount) <= 0) {
      return res.status(400).json({ error: 'actual_amount must be a positive number' });
    }

    if (req.body.vat_percent && (isNaN(parseFloat(req.body.vat_percent)) || parseFloat(req.body.vat_percent) < 0)) {
      return res.status(400).json({ error: 'vat_percent must be a non-negative number' });
    }

    const newExpense = await expenseModel.createExpense(req.body);
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: newExpense
    });
  } catch (err) {
    console.error('Error creating expense:', err);
    if (err.message.includes('Invalid operation number') || err.message.includes('Invalid expense item')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateExpense = async (req, res) => {
  try {
    // Validate required fields
    const { operation_no, client_name, expense_item_id, actual_amount } = req.body;
    
    if (!operation_no || !client_name || !expense_item_id || !actual_amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: operation_no, client_name, expense_item_id, actual_amount' 
      });
    }

    // Validate numeric fields
    if (isNaN(parseFloat(actual_amount)) || parseFloat(actual_amount) <= 0) {
      return res.status(400).json({ error: 'actual_amount must be a positive number' });
    }

    if (req.body.vat_percent && (isNaN(parseFloat(req.body.vat_percent)) || parseFloat(req.body.vat_percent) < 0)) {
      return res.status(400).json({ error: 'vat_percent must be a non-negative number' });
    }

    const updatedExpense = await expenseModel.updateExpense(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense
    });
  } catch (err) {
    console.error('Error updating expense:', err);
    if (err.message.includes('not found') || err.message.includes('Invalid')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await expenseModel.deleteExpense(req.params.id);
    res.json({ 
      success: true,
      message: 'Expense deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting expense:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Additional endpoints for filtering
exports.getExpensesByOperation = async (req, res) => {
  try {
    const expenses = await expenseModel.getExpensesByOperationNo(req.params.operation_no);
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses by operation:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getExpensesByClient = async (req, res) => {
  try {
    const expenses = await expenseModel.getExpensesByClient(req.params.client_name);
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses by client:', err);
    res.status(500).json({ error: err.message });
  }
};
