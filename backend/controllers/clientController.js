const clientModel = require('../models/clientModel');

exports.createClient = async (req, res) => {
  try {
    const clientId = await clientModel.createClient(req.body);
    res.status(201).json({ id: clientId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};