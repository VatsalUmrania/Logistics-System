const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

// Main CRUD routes
router.get('/', receiptController.getAllReceipts);
router.get('/next-receipt', receiptController.getNextReceiptNumber);
router.get('/:id', receiptController.getReceiptById);
router.post('/', receiptController.createReceipt);
router.put('/:id', receiptController.updateReceipt);
router.delete('/:id', receiptController.deleteReceipt);

// Receipt cancellation routes
router.patch('/:id/cancel', receiptController.cancelReceipt);
router.get('/:id/cancellation-history', receiptController.getCancellationHistory);

module.exports = router;
