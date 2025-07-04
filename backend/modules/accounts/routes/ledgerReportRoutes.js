const express = require('express');
const router = express.Router();
const ledgerReportController = require('../controllers/ledgerReportController');
const { authenticate } = require('../../../middleware/auth.middleware');

router.use(authenticate);

router.get('/ledger-accounts', ledgerReportController.getAccounts);
router.get('/ledger-entries', ledgerReportController.getLedgerEntries);

module.exports = router; 