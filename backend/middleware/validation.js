const { body, validationResult } = require('express-validator');

exports.validateJournalVoucher = [
  body('voucherData.voucher_no').notEmpty().withMessage('Voucher number is required'),
  body('voucherData.date').isISO8601().toDate().withMessage('Invalid date format'),
  body('voucherData.payment_type').notEmpty().withMessage('Payment type is required'),
  body('voucherData.total_amount').isFloat({ gt: 0 }).withMessage('Invalid total amount'),
  
  body('entries').isArray({ min: 1 }).withMessage('At least one entry is required'),
  body('entries.*.debit_account_head_id').isInt({ gt: 0 }).withMessage('Invalid debit account head'),
  body('entries.*.credit_account_head_id').isInt({ gt: 0 }).withMessage('Invalid credit account head'),
  body('entries.*.amount').isFloat({ gt: 0 }).withMessage('Invalid entry amount'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];