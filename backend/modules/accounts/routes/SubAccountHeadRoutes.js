const express = require('express');
const router = express.Router();
const controller = require('../controllers/SubAccountHeadController');

// Add logging middleware to debug routes
router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
});

// Get all sub account heads (with optional includeInactive query parameter)
router.get('/', controller.getAll);

// Get account heads for dropdown (only active ones)
router.get('/account-heads', controller.getAccountHeads);

// Get status counts
router.get('/status-counts', controller.getStatusCounts);

// Get sub account head by ID (with optional includeInactive query parameter)
router.get('/:id', controller.getById);

// Create new sub account head
router.post('/', controller.create);

// Update sub account head
router.put('/:id', controller.update);

// Toggle sub account head status
router.put('/:id/toggle-status', controller.toggleStatus);

// Restore soft-deleted sub account head
router.put('/:id/restore', controller.restore);

// Delete sub account head (soft delete)
router.delete('/:id', controller.remove);

module.exports = router;
