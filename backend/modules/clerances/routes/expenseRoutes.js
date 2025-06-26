const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Main CRUD routes
router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

// Additional filtering routes
router.get('/operation/:operation_no', expenseController.getExpensesByOperation);
router.get('/client/:client_name', expenseController.getExpensesByClient);

module.exports = router;
