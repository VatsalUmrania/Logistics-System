const express = require('express');
const router = express.Router();
const supplierAssignmentController = require('../controllers/SupplierAssignmentController');

router.post('/', supplierAssignmentController.createSupplierAssignment);
router.get('/last-invoice', supplierAssignmentController.getLastInvoice);
router.get('/', supplierAssignmentController.getAllSupplierAssignments);

module.exports = router;
