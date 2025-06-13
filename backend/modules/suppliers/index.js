const express = require('express');
const router = express.Router();

// // Test routes
// router.use('/test', require('./routes/testRoutes'));
// // Item routes
// router.use('/items', require('./routes/itemRoutes'));
// Supplier routes
router.use('/suppliers', require('./routes/supplierRoutes'));
// Purchase routes (Add similar for credit notes)
// router.use('/purchases', require('./routes/purchaseRoutes'));
// router.use('/credit-notes', require('./routes/creditNoteRoutes'));

module.exports = router;