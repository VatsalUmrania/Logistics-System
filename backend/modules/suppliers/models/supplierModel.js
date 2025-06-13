const db = require('../../../config/db');

exports.suppliersTableExists = async () => {
  const [tables] = await db.query('SHOW TABLES LIKE "suppliers"');
  return tables.length > 0;
};

exports.getAllSuppliers = async () => {
  const [rows] = await db.query('SELECT * FROM suppliers ORDER BY created_at DESC');
  return rows;
};

exports.getSupplierById = async (id) => {
  const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
  return rows[0];
};

exports.createSupplier = async (supplierData) => {
  const { name, address, phone, email, vat_number, registration_number, registration_date } = supplierData;
  const [result] = await db.query(
    `INSERT INTO suppliers (
      name, address, phone, email, vat_number, 
      registration_number, registration_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, address, phone, email, vat_number, registration_number, registration_date]
  );
  return result.insertId;
};

exports.updateSupplier = async (id, supplierData) => {
  const { name, address, phone, email, vat_number, registration_number, registration_date } = supplierData;
  const [result] = await db.query(
    `UPDATE suppliers SET 
      name = ?, 
      address = ?, 
      phone = ?, 
      email = ?, 
      vat_number = ?, 
      registration_number = ?, 
      registration_date = ?
    WHERE id = ?`,
    [name, address, phone, email, vat_number, registration_number, registration_date, id]
  );
  return result;
};

exports.deleteSupplier = async (id) => {
  const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
  return result;
};