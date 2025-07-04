const express = require('express');
const router = express.Router();
const cashbookController = require('../controllers/cashbookController');
const { authenticate } = require('../../../middleware/auth.middleware');

router.use(authenticate);

router.get('/entries', cashbookController.getCashbookEntries);

module.exports = router; 