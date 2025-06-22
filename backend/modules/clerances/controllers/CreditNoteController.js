const creditNoteModel = require('../models/CreditNote');

exports.getAll = async (req, res) => {
  try {
    const creditNotes = await creditNoteModel.getAllCreditNotes();
    res.json(creditNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const creditNote = await creditNoteModel.getCreditNoteById(req.params.id);
    if (!creditNote) return res.status(404).json({ error: 'Credit note not found' });
    res.json(creditNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newCreditNote = await creditNoteModel.createCreditNote(req.body);
    res.status(201).json(newCreditNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedCreditNote = await creditNoteModel.updateCreditNote(req.params.id, req.body);
    res.json(updatedCreditNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await creditNoteModel.deleteCreditNote(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
