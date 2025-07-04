const express = require('express');
const router = express.Router();

router.use('/accounts-head', require('./routes/accountHeadRoutes'));
router.use('/sub-accounts-head', require('./routes/SubAccountHeadRoutes'));
router.use('/journal-vouchers', require('./routes/VoucherRoutes'));
router.use('/opening-balance',require('./routes/openingBalance'));
router.use('/ledger',require('./routes/ledgerRoutes'));

module.exports = router;