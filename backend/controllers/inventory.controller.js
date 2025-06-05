const db = require('../config/database');

const getAllItems = async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM inventory');
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getItemById = async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM inventory WHERE id = ?',
      [req.params.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createItem = async (req, res) => {
  try {
    const { item_name, description, quantity, unit_price, location } = req.body;

    const [result] = await db.query(
      'INSERT INTO inventory (item_name, description, quantity, unit_price, location) VALUES (?, ?, ?, ?, ?)',
      [item_name, description, quantity, unit_price, location]
    );

    res.status(201).json({
      message: 'Item created successfully',
      itemId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { item_name, description, quantity, unit_price, location } = req.body;

    const [result] = await db.query(
      'UPDATE inventory SET item_name = ?, description = ?, quantity = ?, unit_price = ?, location = ? WHERE id = ?',
      [item_name, description, quantity, unit_price, location, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM inventory WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};