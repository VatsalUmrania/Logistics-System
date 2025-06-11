// const model = require('./masterDataModel');
// const {
//   createHandler,
//   getAllHandler,
//   updateHandler,
//   deleteHandler,
//   updateHandlerByField,
//   deleteHandlerByField
// } = require('../utils/genericHandlers');

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email/username and password are required'
//       });
//     }

//     // Attempt login
//     const userData = await model.loginUser(email, password);

//     if (!userData) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       data: userData
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred during login'
//     });
//   }
// };

// const createUser = async (req, res) => {
//   try {
//     const userData = req.body;

//     // Validate required fields
//     if (!userData.email || !userData.password || !userData.employee_name || !userData.username) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }

//     const userId = await model.createUser(userData);

//     res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       data: { id: userId }
//     });

//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(error.message.includes('already exists') ? 409 : 500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   loginUser,
//   createUser,
//   // Banks
//   createBank: createHandler(model.createBank),
//   getBanks: getAllHandler(model.getBanks),
//   updateBank: updateHandler(model.updateBank),
//   deleteBank: deleteHandler(model.deleteBank),

//   // Clients
//   createClient: createHandler(model.createClient),
//   getClients: getAllHandler(model.getClients),
//   updateClient: updateHandlerByField(model.updateClientByClientId,'client_id'),
//   deleteClient: deleteHandlerByField(model.deleteClientByClientId,'client_id'),
//   // Commodities
//   createCommodity: createHandler(model.createCommodity),
//   getCommodity: getAllHandler(model.getCommodity),
//   updateCommodity: updateHandler(model.updateCommodity),
//   deleteCOmmodity: deleteHandler(model.deleteCommodity),
//   // Categories
//   createCategory: createHandler(model.createCategory),
//   getCategory: getAllHandler(model.getCategory),
//   updateCategory: updateHandlerByField(model.updateCategory, 'sino'),
//   deleteCategory: deleteHandlerByField(model.deleteCategory, 'sino'),

//   // Vessels
//   createVessel: createHandler(model.createVessel),
//   getVessel: getAllHandler(model.getVessel),
//   updateVessel: updateHandler(model.updateVessel),
//   deleteVessel: deleteHandler(model.deleteVessel),
//   // Containers
//   createContainer: createHandler(model.createContainer),
//   getContainer: getAllHandler(model.getContainer),
//   updateContainer: updateHandler(model.updateContainer),
//   deleteContainer: deleteHandler(model.deleteContainer),

//   // Ports
//   createPol: createHandler(model.createPol),    
//   getPol: getAllHandler(model.getPol),        
//   updatePol: updateHandler(model.updatePol),    
//   deletePol: deleteHandler(model.deletePol),    
//   // Users
//   createUser: createHandler(model.createUser),
//   getUser: getAllHandler(model.getUser),
//   updateUser: updateHandler(model.updateUser),
//   deleteUser: deleteHandler(model.deleteUser),
  
// };


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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/username and password are required'
      });
    }

    const userData = await model.loginUser(email, password);
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.email || !userData.password || !userData.employee_name || !userData.username) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const userId = await model.createUser(userData);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: userId }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(error.message.includes('already exists') ? 409 : 500).json({
      success: false,
      message: error.message
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    // Blacklist the token
    await model.blacklistToken(token);

    res.status(200).json({
      success: true,
      message: 'Logout successful, token blacklisted.'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'An error occurred during logout' });
  }
};

module.exports = {
  loginUser,
  createUser,
  logoutUser,
  
  // Banks
  createBank: createHandler(model.createBank),
  getBanks: getAllHandler(model.getBanks),
  updateBank: updateHandler(model.updateBank),
  deleteBank: deleteHandler(model.deleteBank),

  // Clients
  createClient: createHandler(model.createClient),
  getClients: getAllHandler(model.getClients),
  updateClient: updateHandlerByField(model.updateClientByClientId, 'client_id'),
  deleteClient: deleteHandlerByField(model.deleteClientByClientId, 'client_id'),

  // Commodities
  createCommodity: createHandler(model.createCommodity),
  getCommodity: getAllHandler(model.getCommodity),
  updateCommodity: updateHandler(model.updateCommodity),
  deleteCommodity: deleteHandler(model.deleteCommodity), // Fixed typo

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
  getUser: getAllHandler(model.getUser),
  updateUser: updateHandler(model.updateUser), // Uses custom update with password hashing
  deleteUser: deleteHandler(model.deleteUser)
};