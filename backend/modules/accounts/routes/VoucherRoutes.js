const express = require('express');
const router = express.Router();
const journalVoucherController = require('../controllers/journalVoucherController');
const { authenticate } = require('../../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate);

router.post('/', journalVoucherController.createVoucher);
router.get('/', journalVoucherController.getAllVouchers);
router.get('/next-voucher-no', journalVoucherController.getNextVoucherNo);
router.get('/account-data', journalVoucherController.getAccountData);
router.get('/sub-accounts/:headId', journalVoucherController.getSubAccounts);

module.exports = router;