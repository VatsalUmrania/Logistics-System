const express = require('express');
const router = express.Router();
const cashBookController = require('../controllers/CashBookController');

// ✅ Add request logging middleware
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Add error handling middleware for routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with async error handling
router.get('/accounts', asyncHandler(cashBookController.getCashAccounts));
router.get('/transactions', asyncHandler(cashBookController.getTransactions));
router.get('/summary', asyncHandler(cashBookController.getSummary));
router.get('/daily-summary', asyncHandler(cashBookController.getDailySummary));
router.post('/setup-account', asyncHandler(cashBookController.setupCashAccount));

// ✅ Global error handler for this router
router.use((error, req, res, next) => {
    console.error('Cash Book Route Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error in cash book operations'
    });
});

module.exports = router;
