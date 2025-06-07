const express = require('express');
const router = express.Router();
const controller = require('./masterDataController');

// Bank routes
router.post('/banks', controller.createBank);            // Create a new bank
router.get('/banks', controller.getBanks);               // Get all banks
router.put('/banks/:id', controller.updateBank);         // Update bank by id
router.delete('/banks/:id', controller.deleteBank);      // Delete bank by id

// Client routes
router.post('/clients', controller.createClient);
router.get('/clients', controller.getClients);
router.put('/clients/:client_id', controller.updateClient);
router.delete('/clients/:client_id', controller.deleteClient);

// Commodity routes
router.post('/commodities', controller.createCommodity);
router.get('/commodities', controller.getCommodity);

// Category routes
router.post('/categories', controller.createCategory);
router.get('/categories', controller.getCategory);
router.put('/categories/:id', controller.updateCategory);    
router.delete('/categories/:id', controller.deleteCategory);

// Vessel routes
router.post('/vessels', controller.createVessel);
router.get('/vessels', controller.getVessel);

// Container routes
router.post('/containers', controller.createContainer);
router.get('/containers', controller.getContainer);

// Port routes
router.post('/ports', controller.createPort);
router.get('/ports', controller.getPort);

// User routes
router.post('/users', controller.createUser);
router.get('/users', controller.getUser);

module.exports = router;
