const express = require('express');
const router = express.Router();

router.use('/clearance-operations', require('./routes/clearanceOperationsRoutes'));
router.use('/bills', require('./routes/billsRoutes'));
router.use('/expense', require('./routes/expenseRoutes'));
router.use('/expense-item', require('./routes/expenseItemRoutes'));
module.exports = router;