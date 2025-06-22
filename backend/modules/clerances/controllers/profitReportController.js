const profitReportModel = require('../models/profitReportModel');

async function getAllProfitReports(req, res) {
  try {
    const reports = await profitReportModel.getAllProfitReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
}

async function getProfitReportById(req, res) {
  try {
    const report = await profitReportModel.getProfitReportById(req.params.id);
    report 
      ? res.status(200).json(report)
      : res.status(404).json({ message: 'Report not found' });
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error: error.message });
  }
}

async function createProfitReport(req, res) {
  try {
    const newReport = await profitReportModel.createProfitReport(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: "Error creating report", error: error.message });
  }
}

async function updateProfitReport(req, res) {
  try {
    const updatedReport = await profitReportModel.updateProfitReport(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: "Error updating report", error: error.message });
  }
}

async function deleteProfitReport(req, res) {
  try {
    await profitReportModel.deleteProfitReport(req.params.id);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error: error.message });
  }
}

module.exports = {
  getAllProfitReports,
  getProfitReportById,
  createProfitReport,
  updateProfitReport,
  deleteProfitReport
};
