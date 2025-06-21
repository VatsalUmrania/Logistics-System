const express = require('express');
const router = express.Router();

router.use('/clearance-operations', require('./routes/clearanceOperationsRoutes'));
router.use('/bills', require('./routes/billsRoutes'));

module.exports = router;