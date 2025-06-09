const express = require('express');
const router = express.Router();
const vesselController = require('../controllers/vesselController');

router.post('/', vesselController.createVessel);
router.get('/', vesselController.getVessel);
router.put('/:id', vesselController.updateVessel);
router.delete('/:id', vesselController.deleteVessel);

module.exports = router;