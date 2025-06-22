// routes/expenseItemRoutes.js
const express = require('express');
const router = express.Router();
const expenseItemController = require('../controllers/expenseItemController');

router.get('/', expenseItemController.getAllExpenseItems);
router.get('/:id', expenseItemController.getExpenseItemById);
router.post('/', expenseItemController.createExpenseItem);
router.put('/:id', expenseItemController.updateExpenseItem);
router.delete('/:id', expenseItemController.deleteExpenseItem);

module.exports = router;
