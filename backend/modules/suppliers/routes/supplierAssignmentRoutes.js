const express = require('express');
const router = express.Router();
const supplierAssignmentController = require('../controllers/SupplierAssignmentController');

router.post('/', supplierAssignmentController.createSupplierAssignment);
router.get('/last-invoice', supplierAssignmentController.getLastInvoice);
router.get('/', supplierAssignmentController.getAllSupplierAssignments);
router.put('/:id', supplierAssignmentController.updateSupplierAssignment); // Edit route
router.delete('/:id', supplierAssignmentController.deleteSupplierAssignment); 
router.get('/:id', supplierAssignmentController.getSupplierAssignmentById);
module.exports = router;
