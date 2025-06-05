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