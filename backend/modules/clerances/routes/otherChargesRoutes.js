const express = require('express');
const router = express.Router();
const otherChargesController = require('../controllers/otherChargesController');

// Main CRUD routes
router.get('/', otherChargesController.getAllOtherCharges);
router.get('/:id', otherChargesController.getOtherChargeById);
router.post('/', otherChargesController.createOtherCharge);
router.put('/:id', otherChargesController.updateOtherCharge);
router.delete('/:id', otherChargesController.deleteOtherCharge);

// Additional filtering routes
router.get('/operation/:operation_no', otherChargesController.getOtherChargesByOperation);
router.get('/client/:client_name', otherChargesController.getOtherChargesByClient);

module.exports = router;
