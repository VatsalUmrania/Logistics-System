const express = require('express');
const router = express.Router();
const journalVoucherController = require('../controllers/journalVoucherController');

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
router.get('/', asyncHandler(journalVoucherController.getAll));
router.get('/next-voucher-no', asyncHandler(journalVoucherController.getNextVoucherNo));
router.get('/account-data', asyncHandler(journalVoucherController.getAccountData));
router.get('/sub-accounts/:accountHeadId', asyncHandler(journalVoucherController.getSubAccounts));
router.get('/:id', asyncHandler(journalVoucherController.getById));
router.post('/', asyncHandler(journalVoucherController.create));
router.delete('/:id', asyncHandler(journalVoucherController.delete));
router.put('/:id', asyncHandler(journalVoucherController.update)); 
// ✅ Global error handler for this router
router.use((error, req, res, next) => {
    console.error('Journal Voucher Route Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error in journal voucher operations'
    });
});

module.exports = router;
