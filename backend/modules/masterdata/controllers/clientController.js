const clientModel = require('../models/clientModel');

exports.createClient = async (req, res) => {
  try {
    const clientId = await clientModel.createClient(req.body);
    res.status(201).json({ id: clientId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await clientModel.getClients();
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updated = await clientModel.updateClients(req.params.client_id, req.body);
    if (updated === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'client updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW
exports.deleteClient = async (req, res) => {
  try {
    const deleted = await clientModel.deleteClients(req.params.client_id);
    if (deleted === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
