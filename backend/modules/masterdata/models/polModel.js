const db = require('../../../config/db');

// Create a new port (POL)
const createPol = async (polData) => {
  const [result] = await db.query(
    `INSERT INTO ports (name) VALUES (?)`, 
    [polData.name]
  );
  return result.insertId;  // Return the ID of the newly inserted record
};

// Get all ports
const getPol = async () => {
  const [rows] = await db.query('SELECT * FROM ports');
  return rows;
};

// Update an existing port by ID
const updatePol = async (id, polData) => {
  const [result] = await db.query(
    `UPDATE ports SET name = ? WHERE id = ?`,
    [polData.name, id]
  );
  return result.affectedRows > 0;  // Return true if the row was updated
};

// Delete a port by ID
const deletePol = async (id) => {
  try {
    const [result] = await db.query(
      `DELETE FROM ports WHERE id = ?`, 
      [id]
    );
    console.log(`Deleted ${result.affectedRows} row(s) with ID: ${id}`);  // Log affected rows
    return result.affectedRows > 0;  // Return true if any rows were affected
  } catch (err) {
    console.error("Error deleting port:", err);
    throw err;  // Rethrow the error to be handled by the controller
  }
};
module.exports = { createPol, getPol, updatePol, deletePol };
