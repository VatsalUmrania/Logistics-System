const express = require('express');
const router = express.Router();
const portController = require('../controllers/polController');

// Create a new port (POL)
router.post('/', portController.createPol);

// Get all ports (POLs)
router.get('/', portController.getPol);

// Update an existing port (POL) by ID
router.put('/:id', portController.updatePol);

// Delete a port (POL) by ID
router.delete('/:id', controller.deletePol);


module.exports = router;
