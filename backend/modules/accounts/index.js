const express = require('express');
const router = express.Router();

router.use('/balance-sheet', require('./routes/balanceSheetRoutes'));
router.use('/accounts-head', require('./routes/accountHeadRoutes'));
router.use('/sub-accounts-head', require('./routes/SubAccountHeadRoutes'));
router.use('/journal-vouchers', require('./routes/VoucherRoutes'));
router.use('/opening-balance',require('./routes/openingBalance'));
router.use('/ledger',require('./routes/ledgerRoutes'));
router.use('/cash-book', require('./routes/cashBookRoutes'))

module.exports = router;