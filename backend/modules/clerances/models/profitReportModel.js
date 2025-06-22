const pool = require('../../../config/db');

async function getAllProfitReports() {
  const [rows] = await pool.query(`
    SELECT * FROM profit_reports
    ORDER BY report_date DESC
  `);
  return rows;
}

async function getProfitReportById(id) {
  const [rows] = await pool.query(`
    SELECT * FROM profit_reports WHERE id = ?
  `, [id]);
  return rows[0];
}

async function createProfitReport(data) {
  const { report_date, job_number, supplier_id, revenue, cost, profit } = data;
  
  const [result] = await pool.query(`
    INSERT INTO profit_reports 
    (report_date, job_number, supplier_id, revenue, cost, profit)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [report_date, job_number, supplier_id, revenue, cost, profit]);
  
  return { id: result.insertId, ...data };
}

async function updateProfitReport(id, data) {
  const { report_date, job_number, supplier_id, revenue, cost, profit } = data;
  
  await pool.query(`
    UPDATE profit_reports SET
      report_date = ?,
      job_number = ?,
      supplier_id = ?,
      revenue = ?,
      cost = ?,
      profit = ?
    WHERE id = ?
  `, [report_date, job_number, supplier_id, revenue, cost, profit, id]);
  
  return { id, ...data };
}

async function deleteProfitReport(id) {
  await pool.query(`
    DELETE FROM profit_reports WHERE id = ?
  `, [id]);
  return { id };
}

module.exports = {
  getAllProfitReports,
  getProfitReportById,
  createProfitReport,
  updateProfitReport,
  deleteProfitReport
};
