// File: routes/containerRoutes.js
const express = require('express');
const router = express.Router();
const containerController = require('../controllers/containerController');

router.post('/', containerController.createContainer);      // Create
router.get('/', containerController.getContainer);         // Read all
router.put('/:id', containerController.updateContainer);   // Update by ID
router.delete('/:id', containerController.deleteContainer); // Delete by ID

module.exports = router;
