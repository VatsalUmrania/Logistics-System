const express = require('express');
const router = express.Router();
const controller = require('./masterDataController');


router.post('/login', controller.loginUser);
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
router.put('/commodities/:id', controller.updateCommodity);
router.delete('/commodities/:id', controller.deleteCOmmodity);
// Category routes
router.post('/categories', controller.createCategory);
router.get('/categories', controller.getCategory);
router.put('/:sino', controller.updateCategory);
router.delete('/:sino', controller.deleteCategory);


// Vessel routes
router.post('/vessels', controller.createVessel);
router.get('/vessels', controller.getVessel);
router.put('/vessels/:id', controller.updateVessel);
router.delete('/vessels/:id', controller.deleteVessel);
// Container routes
router.post('/containers', controller.createContainer);
router.get('/containers', controller.getContainer);
router.put('/containers/:id', controller.updateContainer);
router.delete('/containers/:id', controller.deleteContainer);
// Port routes
router.post('/ports', controller.createPol);
router.get('/ports', controller.getPol);
router.put('/ports/:id', controller.updatePol);
router.delete('/ports/:id', controller.deletePol);


// User routes
router.post('/users', controller.createUser);
router.get('/users', controller.getUser);
router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

module.exports = router;
