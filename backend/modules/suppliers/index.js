const express = require('express');
const router = express.Router();

// Mount modular routes
// router.use('/test', require('./testRoutes'));
// router.use('/items', require('./itemRoutes'));
router.use('/suppliers', require('./routes/supplierRoutes'));
// router.use('/purchases', require('./purchaseRoutes'));
// router.use('/credit-notes', require('./creditNoteRoutes'));
router.use('/supplier-assignments', require('./routes/supplierAssignmentRoutes'));

router.use('/supplier-credit-notes', require('./routes/supplierCreditNoteRoutes'));

module.exports = router;
