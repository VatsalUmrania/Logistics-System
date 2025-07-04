const Ledger = require('../models/Ledger');
const Joi = require('joi');

// ✅ Validation schemas
const ledgerReportSchema = Joi.object({
    account_head_id: Joi.number().integer().positive().required(),
    sub_account_head_id: Joi.number().integer().positive().required(),
    from_date: Joi.date().iso().required(),
    to_date: Joi.date().iso().min(Joi.ref('from_date')).required()
});

const dateRangeSchema = Joi.object({
    from_date: Joi.date().iso().required(),
    to_date: Joi.date().iso().min(Joi.ref('from_date')).required()
});

const accountBalanceSchema = Joi.object({
    account_head_id: Joi.number().integer().positive().required(),
    sub_account_head_id: Joi.number().integer().positive().required(),
    as_of_date: Joi.date().iso().required()
});

const ledgerController = {
    // ✅ Generate ledger report
    async generateLedgerReport(req, res) {
        try {
            const { account_head_id, sub_account_head_id, from_date, to_date } = req.query;

            // Pre-check: Validate parameters
            const { error, value } = ledgerReportSchema.validate({
                account_head_id: parseInt(account_head_id),
                sub_account_head_id: parseInt(sub_account_head_id),
                from_date,
                to_date
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    error: `Validation error: ${error.details[0].message}`
                });
            }

            const result = await Ledger.getLedgerReport(
                value.account_head_id,
                value.sub_account_head_id,
                value.from_date,
                value.to_date
            );

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Ledger report generated successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in generateLedgerReport controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while generating ledger report'
            });
        }
    },

    // ✅ Get accounts for dropdown
    async getAccountsForDropdown(req, res) {
        try {
            const result = await Ledger.getAccountsForDropdown();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Accounts retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getAccountsForDropdown controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching accounts'
            });
        }
    },

    // ✅ Get account summary
    async getAccountSummary(req, res) {
        try {
            const { from_date, to_date } = req.query;

            // Pre-check: Validate dates
            const { error, value } = dateRangeSchema.validate({ from_date, to_date });
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: `Validation error: ${error.details[0].message}`
                });
            }

            const result = await Ledger.getAccountSummary(value.from_date, value.to_date);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Account summary retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getAccountSummary controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching account summary'
            });
        }
    },

    // ✅ Get trial balance
    async getTrialBalance(req, res) {
        try {
            const { as_of_date } = req.query;

            // Pre-check: Validate date
            if (!as_of_date) {
                return res.status(400).json({
                    success: false,
                    error: 'as_of_date is required'
                });
            }

            const asOfDate = new Date(as_of_date);
            if (isNaN(asOfDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid date format for as_of_date'
                });
            }

            const result = await Ledger.getTrialBalance(as_of_date);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Trial balance retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getTrialBalance controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching trial balance'
            });
        }
    },

    // ✅ Get account balance
    async getAccountBalance(req, res) {
        try {
            const { account_head_id, sub_account_head_id, as_of_date } = req.query;

            // Pre-check: Validate parameters
            const { error, value } = accountBalanceSchema.validate({
                account_head_id: parseInt(account_head_id),
                sub_account_head_id: parseInt(sub_account_head_id),
                as_of_date
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    error: `Validation error: ${error.details[0].message}`
                });
            }

            const result = await Ledger.getAccountBalance(
                value.account_head_id,
                value.sub_account_head_id,
                value.as_of_date
            );

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Account balance retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getAccountBalance controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching account balance'
            });
        }
    },

    // ✅ Get ledger statistics
    async getLedgerStatistics(req, res) {
        try {
            const { from_date, to_date } = req.query;

            // Pre-check: Validate dates
            const { error, value } = dateRangeSchema.validate({ from_date, to_date });
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: `Validation error: ${error.details[0].message}`
                });
            }

            const result = await Ledger.getLedgerStatistics(value.from_date, value.to_date);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            res.status(200).json({
                success: true,
                message: 'Ledger statistics retrieved successfully',
                data: result.data
            });
        } catch (error) {
            console.error('Error in getLedgerStatistics controller:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching ledger statistics'
            });
        }
    }
};

module.exports = ledgerController;
