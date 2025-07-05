const express = require('express');
const router = express.Router();
const accountHeadController = require('../controllers/accountHeadController');
const db      = require('../../../config/db');

// Add logging middleware to debug routes
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// GET /api/accounts-head - Get all account heads with search and pagination
router.get('/', accountHeadController.getAllAccountHeads);

router.get('/balance-sheet', async (req, res) => {
  const asOf = req.query.asOf ?? new Date().toISOString().substring(0,10);

  try {
    const [assets] = await db.query(`
      SELECT g.group_name AS \`group\`, ah.account_head AS name, 
             SUM(le.debit - le.credit) AS amount
      FROM ledger_entries le
      JOIN account_heads ah  ON ah.id = le.account_head_id
      JOIN account_groups g  ON g.id  = ah.group_id
      WHERE le.entry_date <= ?
      AND ah.account_type = 'Asset'
      GROUP BY ah.id
    `, [asOf]);

    const [liab] = await db.query(`
      SELECT g.group_name AS \`group\`, ah.account_head AS name, 
             SUM(le.credit - le.debit) AS amount
      FROM ledger_entries le
      JOIN account_heads ah  ON ah.id = le.account_head_id
      JOIN account_groups g  ON g.id  = ah.group_id
      WHERE le.entry_date <= ?
      AND ah.account_type = 'Liability'
      GROUP BY ah.id
    `, [asOf]);

    const [eq] = await db.query(`
      SELECT g.group_name AS \`group\`, ah.account_head AS name, 
             SUM(le.credit - le.debit) AS amount
      FROM ledger_entries le
      JOIN account_heads ah  ON ah.id = le.account_head_id
      JOIN account_groups g  ON g.id  = ah.group_id
      WHERE le.entry_date <= ?
      AND ah.account_type = 'Equity'
      GROUP BY ah.id
    `, [asOf]);

    res.json({ success: true, data: { assets, liabilities: liab, equity: eq } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


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
