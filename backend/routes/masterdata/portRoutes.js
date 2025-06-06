const express = require('express');
const router = express.Router();
const portController = require('../controllers/portController');

router.post('/', portController.createPort);
router.get('/', portController.getPort);

module.exports = router;