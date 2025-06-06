const bankModel = require('../models/bankModel');

exports.createBank = async (req, res) => {
  try {
    const bankId = await bankModel.createBank(req.body);
    res.status(201).json({ id: bankId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBanks = async (req, res) => {
  try {
    const banks = await bankModel.getAllBanks();
    res.json(banks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW
exports.updateBank = async (req, res) => {
  try {
    const updated = await bankModel.updateBank(req.params.id, req.body);
    if (updated === 0) {
      return res.status(404).json({ error: 'Bank not found' });
    }
    res.json({ message: 'Bank updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW
exports.deleteBank = async (req, res) => {
  try {
    const deleted = await bankModel.deleteBank(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Bank not found' });
    }
    res.json({ message: 'Bank deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
