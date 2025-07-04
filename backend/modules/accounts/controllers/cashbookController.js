const { CashbookEntry } = require('../models');
const { Op } = require('sequelize');

// Get cashbook entries by date range
exports.getCashbookEntries = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const entries = await CashbookEntry.findAll({
      where: {
        date: {
          [Op.between]: [fromDate, toDate]
        }
      },
      order: [['date', 'DESC'], ['id', 'DESC']]
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cashbook entries', details: error.message });
  }
}; 