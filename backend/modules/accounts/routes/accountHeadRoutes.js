const express = require('express');
const router = express.Router();
const accountHeadController = require('../controllers/accountHeadController');

// Add logging middleware to debug routes
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// GET /api/accounts-head - Get all account heads with search and pagination
router.get('/', accountHeadController.getAllAccountHeads);

// GET /api/accounts-head/types - Get account types
router.get('/types', accountHeadController.getAccountTypes);

// GET /api/accounts-head/active - Get active account heads for dropdown
router.get('/active', accountHeadController.getActiveAccountHeads);

// GET /api/accounts-head/status-counts - Get status counts
router.get('/status-counts', accountHeadController.getStatusCounts);

// GET /api/accounts-head/:id - Get account head by ID
router.get('/:id', accountHeadController.getAccountHeadById);

// POST /api/accounts-head - Create new account head
router.post('/', accountHeadController.createAccountHead);

// PUT /api/accounts-head/:id - Update account head
router.put('/:id', accountHeadController.updateAccountHead);

// PUT /api/accounts-head/:id/toggle-status - Toggle account head status
router.put('/:id/toggle-status', accountHeadController.toggleAccountHeadStatus);

// PUT /api/accounts-head/:id/restore - Restore soft-deleted account head
router.put('/:id/restore', accountHeadController.restoreAccountHead);

// DELETE /api/accounts-head/:id - Delete account head (soft delete)
router.delete('/:id', accountHeadController.deleteAccountHead);

module.exports = router;
