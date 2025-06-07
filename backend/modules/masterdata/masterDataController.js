const model = require('./masterDataModel');
const {
  createHandler,
  getAllHandler,
  updateHandler,
  deleteHandler,
  updateHandlerByField,
  deleteHandlerByField,
} = require('../utils/genericHandlers');


module.exports = {
  // Banks
  createBank: createHandler(model.createBank),
  getBanks: getAllHandler(model.getBanks),
  updateBank: updateHandler(model.updateBank),
  deleteBank: deleteHandler(model.deleteBank),

  // Clients
  createClient: createHandler(model.createClient),
  getClients: getAllHandler(model.getClients),
  updateClient: updateHandlerByField(model.updateClientByClientId,'client_id'),
  deleteClient: deleteHandlerByField(model.deleteClientByClientId,'client_id'),
  // Commodities
  createCommodity: createHandler(model.createCommodity),
  getCommodity: getAllHandler(model.getCommodity),

  // Categories
  createCategory: createHandler(model.createCategory),
  getCategory: getAllHandler(model.getCategory),
  updateCategory: updateHandlerByField(model.updateCategory, 'sino'),
  deleteCategory: deleteHandlerByField(model.deleteCategory, 'sino'),

  // Vessels
  createVessel: createHandler(model.createVessel),
  getVessel: getAllHandler(model.getVessel),

  // Containers
  createContainer: createHandler(model.createContainer),
  getContainer: getAllHandler(model.getContainer),
  updateContainer: updateHandler(model.updateContainer),
  deleteContainer: deleteHandler(model.deleteContainer),

  // Ports
  createPol: createHandler(model.createPol),    
  getPol: getAllHandler(model.getPol),        
  updatePol: updateHandler(model.updatePol),    
  deletePol: deleteHandler(model.deletePol),    
  // Users
  createUser: createHandler(model.createUser),
  getUser: getAllHandler(model.getUser),
};
