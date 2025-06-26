const express = require('express');
const router = express.Router();
const accountHeadController = require('../controllers/accountHeadController');
// OR if using modules structure:
// const accountHeadController = require('../modules/accounts/controllers/accountHeadController');

// Add logging middleware to debug routes
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// GET /api/account-heads - Get all account heads with search and pagination
router.get('/', accountHeadController.getAllAccountHeads);

// GET /api/account-heads/types - Get account types
router.get('/types', accountHeadController.getAccountTypes);

// GET /api/account-heads/:id - Get account head by ID
router.get('/:id', accountHeadController.getAccountHeadById);

// POST /api/account-heads - Create new account head
router.post('/', accountHeadController.createAccountHead);

// PUT /api/account-heads/:id - Update account head
router.put('/:id', accountHeadController.updateAccountHead);

// DELETE /api/account-heads/:id - Delete account head
router.delete('/:id', accountHeadController.deleteAccountHead);

module.exports = router;
