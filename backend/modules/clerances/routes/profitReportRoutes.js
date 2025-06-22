const express = require('express');
const router = express.Router();
const profitReportController = require('../controllers/profitReportController');

router.get('/', profitReportController.getAllProfitReports);
router.get('/:id', profitReportController.getProfitReportById);
router.post('/', profitReportController.createProfitReport);
router.put('/:id', profitReportController.updateProfitReport);
router.delete('/:id', profitReportController.deleteProfitReport);

module.exports = router;
