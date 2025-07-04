const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/LedgerController');

// ✅ Add request logging middleware
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Add error handling middleware for routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Main ledger routes
router.get('/accounts', asyncHandler(ledgerController.getAccountsForDropdown));
router.get('/report', asyncHandler(ledgerController.generateLedgerReport));
router.get('/summary', asyncHandler(ledgerController.getAccountSummary));
router.get('/trial-balance', asyncHandler(ledgerController.getTrialBalance));
router.get('/account-balance', asyncHandler(ledgerController.getAccountBalance));
router.get('/statistics', asyncHandler(ledgerController.getLedgerStatistics));

// ✅ Global error handler for this router
router.use((error, req, res, next) => {
    console.error('Ledger Route Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error in ledger operations'
    });
});

module.exports = router;


// Available API Endpoints
// ✅ Main Endpoints
// GET /api/ledger/accounts - Get all accounts for dropdown

// GET /api/ledger/report - Generate ledger report

// Query params: account_head_id, sub_account_head_id, from_date, to_date

// GET /api/ledger/summary - Get account summary for date range

// Query params: from_date, to_date

// GET /api/ledger/trial-balance - Get trial balance

// Query params: as_of_date

// GET /api/ledger/account-balance - Get specific account balance

// Query params: account_head_id, sub_account_head_id, as_of_date

// GET /api/ledger/statistics - Get ledger statistics

// Query params: from_date, to_date