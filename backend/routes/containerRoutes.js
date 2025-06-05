const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');

router.post('/', containerController.createContainer);
router.get('/', containerController.getContainer);

module.exports = router;