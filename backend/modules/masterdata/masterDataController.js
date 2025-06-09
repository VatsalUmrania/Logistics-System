const model = require('./masterDataModel');
const {
  createHandler,
  getAllHandler,
  updateHandler,
  deleteHandler,
  updateHandlerByField,
  deleteHandlerByField
} = require('../utils/genericHandlers');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await model.loginUser(email, password);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  loginUser,
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
  updateCommodity: updateHandler(model.updateCommodity),
  deleteCOmmodity: deleteHandler(model.deleteCommodity),
  // Categories
  createCategory: createHandler(model.createCategory),
  getCategory: getAllHandler(model.getCategory),
  updateCategory: updateHandlerByField(model.updateCategory, 'sino'),
  deleteCategory: deleteHandlerByField(model.deleteCategory, 'sino'),

  // Vessels
  createVessel: createHandler(model.createVessel),
  getVessel: getAllHandler(model.getVessel),
  updateVessel: updateHandler(model.updateVessel),
  deleteVessel: deleteHandler(model.deleteVessel),
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
  updateUser: updateHandler(model.updateUser),
  deleteUser: deleteHandler(model.deleteUser),
  
};
