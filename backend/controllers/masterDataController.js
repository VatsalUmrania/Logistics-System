const model = require('../models/masterDataModel');

// Generic create controller
const createHandler = (modelMethod) => async (req, res) => {
  try {
    const id = await modelMethod(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generic get all controller
const getAllHandler = (modelMethod) => async (req, res) => {
  try {
    const data = await modelMethod();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  // Banks
  createBank: createHandler(model.createBank),
  getBanks: getAllHandler(model.getBanks),
  
  // Clients
  createClient: createHandler(model.createClient),
  getClients: getAllHandler(model.getClients),
  
  // Commodities
  createCommodity: createHandler(model.createCommodity),
  getCommodity: getAllHandler(model.getCommodity),
  
  // Categories
  createCategory: createHandler(model.createCategory),
  getCategory: getAllHandler(model.getCategory),
  
  // Vessels
  createVessel: createHandler(model.createVessel),
  getVessel: getAllHandler(model.getVessel),
  // Containers
  createContainer: createHandler(model.createContainer),
  getContainer: getAllHandler(model.getContainer),
  // Ports
  createPort: createHandler(model.createPort),
  getPort: getAllHandler(model.getPort),
  // Users
  createUser: createHandler(model.createUser),
  getUser: getAllHandler(model.getUser)
};
