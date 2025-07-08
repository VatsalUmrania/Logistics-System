const deliveryNoteModel = require('../models/deliveryNoteModel');
const pool = require('../../../config/db');
exports.getAllDeliveryNotes = async (req, res) => {
  try {
    const { client_name, start_date, end_date } = req.query;
    let notes;

    if (client_name) {
      notes = await deliveryNoteModel.getDeliveryNotesByClient(client_name);
    } else if (start_date && end_date) {
      notes = await deliveryNoteModel.getDeliveryNotesByDateRange(start_date, end_date);
    } else {
      notes = await deliveryNoteModel.getAllDeliveryNotes();
    }

    res.json(notes);
  } catch (err) {
    console.error('Error fetching delivery notes:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDeliveryNoteById = async (req, res) => {
  try {
    const note = await deliveryNoteModel.getDeliveryNoteById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: 'Delivery note not found' });
    }
  } catch (err) {
    console.error('Error fetching delivery note by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createDeliveryNote = async (req, res) => {
  try {
    // Validate required fields
    const { delivery_note_no, delivery_date } = req.body;
    
    if (!delivery_note_no || !delivery_date) {
      return res.status(400).json({
        error: 'Missing required fields: delivery_note_no, delivery_date'
      });
    }

    const newNote = await deliveryNoteModel.createDeliveryNote(req.body);
    res.status(201).json({
      success: true,
      message: 'Delivery note created successfully',
      data: newNote
    });
  } catch (err) {
    console.error('Error creating delivery note:', err);
    if (err.message.includes('already exists') || err.message.includes('Missing required fields')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateDeliveryNote = async (req, res) => {
  try {
    // Validate required fields
    const { delivery_note_no, delivery_date } = req.body;
    
    if (!delivery_note_no || !delivery_date) {
      return res.status(400).json({
        error: 'Missing required fields: delivery_note_no, delivery_date'
      });
    }

    const updatedNote = await deliveryNoteModel.updateDeliveryNote(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Delivery note updated successfully',
      data: updatedNote
    });
  } catch (err) {
    console.error('Error updating delivery note:', err);
    if (err.message.includes('not found') || err.message.includes('already exists')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteDeliveryNote = async (req, res) => {
  try {
    await deliveryNoteModel.deleteDeliveryNote(req.params.id);
    res.json({
      success: true,
      message: 'Delivery note deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting delivery note:', err);
    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Additional endpoints
exports.getDeliveryNotesByClient = async (req, res) => {
  try {
    const notes = await deliveryNoteModel.getDeliveryNotesByClient(req.params.client_name);
    res.json(notes);
  } catch (err) {
    console.error('Error fetching delivery notes by client:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getNextDeliveryNoteNumber = async (req, res) => {
  try {
    // Get the latest delivery note number
    const [rows] = await pool.query(`
      SELECT delivery_note_no 
      FROM delivery_notes 
      WHERE delivery_note_no LIKE 'DN-%' 
      ORDER BY CAST(SUBSTRING(delivery_note_no, 4) AS UNSIGNED) DESC 
      LIMIT 1
    `);
    
    let nextNumber = 1;
    if (rows.length > 0) {
      const lastNumber = rows[0].delivery_note_no;
      const numberPart = parseInt(lastNumber.replace('DN-', ''));
      nextNumber = numberPart + 1;
    }
    
    const nextDN = `DN-${nextNumber.toString().padStart(3, '0')}`;
    
    res.json({ nextDeliveryNoteNumber: nextDN });
  } catch (err) {
    console.error('Error getting next delivery note number:', err);
    res.status(500).json({ error: err.message });
  }
};