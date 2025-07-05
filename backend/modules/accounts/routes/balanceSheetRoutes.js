const express = require('express');
const router = express.Router();
const balanceSheetController = require('../controllers/balanceSheetController');

// ✅ Add request logging middleware
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Add error handling middleware for routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Main balance sheet routes
router.get('/', asyncHandler(balanceSheetController.getBalanceSheet));
router.get('/categories', asyncHandler(balanceSheetController.getAccountCategories));
router.get('/summary', asyncHandler(balanceSheetController.getBalanceSheetSummary));
router.get('/trial-balance', asyncHandler(balanceSheetController.getTrialBalance));

// ✅ Global error handler for this router
router.use((error, req, res, next) => {
    console.error('Balance Sheet Route Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error in balance sheet operations'
    });
});

module.exports = router;
