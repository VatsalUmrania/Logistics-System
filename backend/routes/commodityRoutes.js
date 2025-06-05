const express = require('express');
const router = express.Router();
const commodityController = require('../controllers/commodityController');

router.post('/', commodityController.createCommodity);
router.get('/', commodityController.getCommodity);

module.exports = router;