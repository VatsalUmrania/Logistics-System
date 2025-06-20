const express = require('express');
const router = express.Router();
const operationRoutes = require('./routers/operationRoutes');

// Mount operation routes
router.use('/operations', operationRoutes);

module.exports = router;