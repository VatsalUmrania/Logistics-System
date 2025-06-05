const express = require('express');
const router = express.Router();
const controller = require('../controllers/masterDataController');

// Bank routes
router.post('/banks', controller.createBank);
router.get('/banks', controller.getBanks);

// Client routes
router.post('/clients', controller.createClient);
router.get('/clients', controller.getClients);

// Commodity routes
router.post('/commodities', controller.createCommodity);
router.get('/commodities', controller.getCommodity);
// Category routes
router.post('/categories', controller.createCategory);
router.get('/categories', controller.getCategory);
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