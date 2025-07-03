const { JournalVoucher } = require('../models/JournalVoucher');
const { JournalVoucherEntry } = require("../models/JournalVoucherEntry");
const { AccountHead } = require('../models/AccountHead');
const { AccountSubHead } = require('../models/SubAccountHead');
const { Op } = require('sequelize');

// Generate voucher number (JV-YYYY-XXXX)
async function generateVoucherNo(prefix = 'JV') {
  const year = new Date().getFullYear();
  const lastVoucher = await JournalVoucher.findOne({
    where: {
      voucher_no: {
        [Op.like]: `${prefix}-${year}-%`
      }
    },
    order: [['created_at', 'DESC']]
  });

  let sequence = 1;
  if (lastVoucher) {
    const lastSeq = parseInt(lastVoucher.voucher_no.split('-')[2]) || 0;
    sequence = lastSeq + 1;
  }

  return `${prefix}-${year}-${sequence.toString().padStart(4, '0')}`;
}

// Create new journal voucher
exports.createVoucher = async (req, res) => {
  try {
    const { voucherData, entries } = req.body;
    
    // Calculate total amount from entries
    const totalAmount = entries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    
    const voucher = await JournalVoucher.create({
      voucher_no: voucherData.voucher_no,
      date: voucherData.date,
      payment_type: voucherData.payment_type,
      total_amount: totalAmount
    });

    const entryPromises = entries.map(entry => 
      JournalVoucherEntry.create({
        voucher_id: voucher.id,
        debit_account_head_id: entry.debit_account_head_id,
        debit_account_subhead_id: entry.debit_account_subhead_id,
        credit_account_head_id: entry.credit_account_head_id,
        credit_account_subhead_id: entry.credit_account_subhead_id,
        amount: entry.amount,
        remarks: entry.remarks
      })
    );

    await Promise.all(entryPromises);

    res.status(201).json({
      message: 'Journal voucher created successfully',
      voucherId: voucher.id
    });
  } catch (error) {
    console.error('Error creating journal voucher:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// Get all journal vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await JournalVoucher.findAll({
      include: [{
        model: JournalVoucherEntry,
        as: 'entries',
        attributes: ['id', 'amount', 'remarks']
      }],
      order: [['date', 'DESC']]
    });

    res.json(vouchers);
  } catch (error) {
    console.error('Error fetching journal vouchers:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// Get next voucher number
exports.getNextVoucherNo = async (req, res) => {
  try {
    const voucherNo = await generateVoucherNo('JV');
    res.json({ voucher_no: voucherNo });
  } catch (error) {
    console.error('Error generating voucher number:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// Get account data for voucher creation
exports.getAccountData = async (req, res) => {
  try {
    const accountHeads = await AccountHead.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    const paymentTypes = ['Cash', 'Cheque', 'Bank Transfer', 'Online Payment'];
    res.json({ accountHeads, paymentTypes });
  } catch (error) {
    console.error('Error fetching account data:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

// Get sub-accounts by account head ID
exports.getSubAccounts = async (req, res) => {
  try {
    const headId = req.params.headId;
    const subAccounts = await AccountSubHead.findAll({
      where: { head_id: headId },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    
    res.json(subAccounts);
  } catch (error) {
    console.error('Error fetching sub accounts:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};