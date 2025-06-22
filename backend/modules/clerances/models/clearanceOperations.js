// models/clearanceOperations.js
const db = require('../../../config/db');  // Assuming db.js handles the DB connection

const formatDate = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' '); // MySQL-friendly
  };
  
const ClearanceOperations = {
  // CREATE operation
  create: async (data) => {
    try {
      const {
        operation_type, transport_mode, client, client_ref_name, bayan_no, 
        date, yard_date, line, line_agent, bayan_date, hijri_date, status, 
        job_no, vessel, representative, payment_date, end_date, notes, commodity, 
        net_weight, receiving_rep, group_name, release_date, bl, no_of_packages, 
        gross_weight, pod, shipper, pol, eta, po_no 
      } = data;

      // Insert operation without the auto-increment `id` column and with `CURRENT_TIMESTAMP` for `created_at`
      const [result] = await db.query(
        `INSERT INTO clearance_operations (
          operation_type, transport_mode, client, client_ref_name, bayan_no, 
          date, yard_date, line, line_agent, bayan_date, hijri_date, status, 
          job_no, vessel, representative, payment_date, end_date, notes, commodity, 
          net_weight, receiving_rep, group_name, release_date, bl, no_of_packages, 
          gross_weight, pod, shipper, pol, eta, po_no, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
            operation_type, transport_mode, client, client_ref_name, bayan_no,
            formatDate(date), formatDate(yard_date), line, line_agent, formatDate(bayan_date), hijri_date, status,
            job_no, vessel, representative, formatDate(payment_date), formatDate(end_date), notes, commodity,
            net_weight, receiving_rep, group_name, formatDate(release_date), bl, no_of_packages,
            gross_weight, pod, shipper, pol, eta, po_no, formatDate(new Date()) // created_at
        ]          
      );

      return result;
    } catch (err) {
      throw err;
    }
  },

  // GET all operations
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM clearance_operations');
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // GET operation by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM clearance_operations WHERE id = ?', [id]);
      return rows[0];  // Return the first result
    } catch (err) {
      throw err;
    }
  },

  // UPDATE an operation
  update: async (id, data) => {
    try {
      const {
        operation_type, transport_mode, client, client_ref_name, bayan_no, date, yard_date, line, 
        line_agent, bayan_date, hijri_date, status, job_no, vessel, representative, payment_date, 
        end_date, notes, commodity, net_weight, receiving_rep, group_name, release_date, bl, 
        no_of_packages, gross_weight, pod, shipper, pol, eta, po_no
      } = data;

      const [result] = await db.query(
        `UPDATE clearance_operations SET 
  operation_type = ?, 
  transport_mode = ?, 
  client = ?, 
  client_ref_name = ?, 
  bayan_no = ?, 
  date = ?, 
  yard_date = ?, 
  line = ?, 
  line_agent = ?, 
  bayan_date = ?, 
  hijri_date = ?, 
  status = ?, 
  job_no = ?, 
  vessel = ?, 
  representative = ?, 
  payment_date = ?, 
  end_date = ?, 
  notes = ?, 
  commodity = ?, 
  net_weight = ?, 
  receiving_rep = ?, 
  group_name = ?, 
  release_date = ?, 
  bl = ?, 
  no_of_packages = ?, 
  gross_weight = ?, 
  pod = ?, 
  shipper = ?, 
  pol = ?, 
  eta = ?, 
  po_no = ? 
WHERE id = ?
`,
[
    operation_type, transport_mode, client, client_ref_name, bayan_no,
    formatDate(date), formatDate(yard_date), line, line_agent, formatDate(bayan_date),
    hijri_date, status, job_no, vessel, representative, formatDate(payment_date),
    formatDate(end_date), notes, commodity,
    parseFloat(net_weight), // <-- must be a number
    receiving_rep, group_name, formatDate(release_date), bl,
    parseInt(no_of_packages), // <-- must be an integer
    parseFloat(gross_weight), // <-- must be a number
    pod, shipper, pol, eta, po_no,
    id // at the end
  ]
  
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  // DELETE operation
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM clearance_operations WHERE id = ?', [id]);
      return result;
    } catch (err) {
      throw err;
    }
  },
  updateStatus: async (id, status) => {
    try {
      // Validate status input
      if (!['Active', 'Inactive'].includes(status)) {
        throw new Error('Invalid status value');
      }
  
      const [result] = await db.query(
        'UPDATE clearance_operations SET status = ? WHERE id = ?',
        [status, id]
      );
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        throw new Error('Operation not found');
      }
  
      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllJobNo: async() =>{
    try {
      const [rows] = await db.query('SELECT job_no FROM clearance_operations');
      return rows; 
    } catch (err) {
      throw err;
    }
  }
};

module.exports = ClearanceOperations;
