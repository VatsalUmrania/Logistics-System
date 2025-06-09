// Generic create controller
const createHandler = (modelMethod) => async (req, res) => {
  try {
    const id = await modelMethod(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generic get all controller
const getAllHandler = (modelMethod) => async (req, res) => {
  try {
    const data = await modelMethod();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update handler for records by id (expects req.params.id and req.body)
const updateHandler = (modelMethod) => async (req, res) => {
  try {
    const id = req.params.id;
    await modelMethod(id, req.body);
    res.json({ message: 'Record updated successfully', id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete handler for records by id (expects req.params.id)
const deleteHandler = (modelMethod) => async (req, res) => {
  try {
    const id = req.params.id;
    await modelMethod(id);
    res.json({ message: 'Record deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateHandlerByField = (modelMethod, field = 'id') => async (req, res) => {
  try {
    const identifier = req.params[field];
    const updated = await modelMethod(identifier, req.body);

    if (!updated || (typeof updated === 'object' && Object.keys(updated).length === 0)) {
      return res.status(404).json({ error: `${field} not found` });
    }

    res.json({ message: 'Record updated successfully', [field]: identifier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generic delete handler with field name and result check
const deleteHandlerByField = (modelMethod, field = 'id') => async (req, res) => {
  try {
    const identifier = req.params[field];
    const deleted = await modelMethod(identifier);

    if (!deleted || (typeof deleted === 'object' && Object.keys(deleted).length === 0)) {
      return res.status(404).json({ error: `${field} not found` });
    }

    res.json({ message: 'Record deleted successfully', [field]: identifier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await model.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ success: true, message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createHandler,
  getAllHandler,
  updateHandler,
  deleteHandler,
  updateHandlerByField,
  deleteHandlerByField,
  loginUser
}