const express = require('express');
const router = express.Router();

router.use('/accounts-head', require('./routes/accountHeadRoutes'));
router.use('/sub-account-head', require('./routes/SubAccountHeadRoutes'));
router.use('/journal-vouchers', require('./routes/VoucherRoutes'));


module.exports = router;