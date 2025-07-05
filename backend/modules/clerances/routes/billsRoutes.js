const express = require('express');
const router = express.Router();
const billsController = require('../controllers/billsController');

// Create a new bill
router.post('/', billsController.create);

// Get all bills
router.get('/', billsController.getAll);

// Get bill by ID
router.get('/:id', billsController.getById);

// Get bills by operation ID
router.get('/operation/:operation_id', billsController.getByOperationId);

// Update a bill
router.put('/:id', billsController.update);

// Delete a bill
router.delete('/:id', billsController.delete);

// Delete bills by operation ID
router.delete('/operation/:operation_id', billsController.deleteByOperationId);

module.exports = router;
