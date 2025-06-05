const express = require('express');
const router = express.Router();
const vesselController = require('../controllers/vesselController');

router.post('/', vesselController.createVessel);
router.get('/', vesselController.getVessel);

module.exports = router;