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

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await model.getUserById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = userData;

    return res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user data',
    });
  }
};

// Categories
const createCategory = createHandler(model.createCategory);
const getCategories = getAllHandler(model.getCategories);
const getCategoryBySino = async (req, res) => {
  try {
    const sino = req.params.sino;
    const category = await model.getCategoryBySino(sino);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateCategory = updateHandlerByField(model.updateCategory, 'sino');
const deleteCategory = deleteHandlerByField(model.deleteCategory, 'sino');
module.exports = {
  loginUser,
  createUser,
  logoutUser,
  getCurrentUser,
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
  createCategory,
  getCategories,
  getCategoryBySino,
  updateCategory,
  deleteCategory,
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