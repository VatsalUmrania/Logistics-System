const express = require('express');
const { route } = require('./routes/openingBalance');
const router = express.Router();

router.use('/accounts-head', require('./routes/accountHeadRoutes'));
router.use('/sub-accounts-head', require('./routes/SubAccountHeadRoutes'));
router.use('/journal-vouchers', require('./routes/VoucherRoutes'));
router.use('/opening-balance',require('./routes/openingBalance'))

module.exports = router;