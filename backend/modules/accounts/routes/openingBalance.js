const express = require('express');
const router = express.Router();
const openingBalanceController = require('../controllers/openingBalanceController');

// ✅ Graceful: Add request logging middleware
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Graceful: Add error handling middleware for routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with async error handling
router.get('/', asyncHandler(openingBalanceController.getAll));
router.get('/totals', asyncHandler(openingBalanceController.getTotals));
router.get('/:id', asyncHandler(openingBalanceController.getById));
router.post('/', asyncHandler(openingBalanceController.create));
router.put('/:id', asyncHandler(openingBalanceController.update));
router.delete('/:id', asyncHandler(openingBalanceController.delete));

// ✅ Graceful: Global error handler for this router
router.use((error, req, res, next) => {
    console.error('Opening Balance Route Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error in opening balance operations'
    });
});

module.exports = router;
