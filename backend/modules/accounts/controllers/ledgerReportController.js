const { LedgerEntry } = require('../models');
const { Op } = require('sequelize');

// Get all accounts (for dropdown)
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await LedgerEntry.findAll({
      attributes: [
        [LedgerEntry.sequelize.fn('DISTINCT', LedgerEntry.sequelize.col('account_name')), 'account_name']
      ],
      order: [['account_name', 'ASC']]
    });
    res.json(accounts.map(a => a.account_name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts', details: error.message });
  }
};

// Get ledger entries by account and date range
exports.getLedgerEntries = async (req, res) => {
  try {
    const { fromDate, toDate, accountName } = req.query;
    if (!fromDate || !toDate || !accountName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const entries = await LedgerEntry.findAll({
      where: {
        account_name: accountName,
        date: {
          [Op.between]: [fromDate, toDate]
        }
      },
      order: [['date', 'ASC'], ['id', 'ASC']]
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ledger entries', details: error.message });
  }
}; 