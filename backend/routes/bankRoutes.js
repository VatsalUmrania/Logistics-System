const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

router.post('/', bankController.createBank);
router.get('/', bankController.getBanks);

module.exports = router;