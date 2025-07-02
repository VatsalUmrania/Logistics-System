const SubAccountHead = require('../models/SubAccountHead');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await SubAccountHead.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { account_head, sub_account_head } = req.body;
    await SubAccountHead.create({ account_head, sub_account_head });
    res.status(201).json({ message: 'Sub Account Head created' });
  } catch (err) {
    res.status(500).json({ error: 'Creation failed' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { account_head, sub_account_head } = req.body;
    await SubAccountHead.update(id, { account_head, sub_account_head });
    res.json({ message: 'Sub Account Head updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await SubAccountHead.delete(id);
    res.json({ message: 'Sub Account Head deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
