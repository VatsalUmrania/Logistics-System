require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Use environment variables for DB config
const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_db_name',
  process.env.DB_USER || 'your_db_user',
  process.env.DB_PASSWORD || 'your_db_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const JournalVoucher = require('./JournalVoucher')(sequelize, DataTypes);
const JournalVoucherEntry = require('./JournalVoucherEntry')(sequelize, DataTypes);
const LedgerEntry = require('./LedgerEntry')(sequelize, DataTypes);
const CashbookEntry = require('./CashbookEntry')(sequelize, DataTypes);

// Set up associations if needed
if (JournalVoucher.associate) {
  JournalVoucher.associate({ JournalVoucherEntry });
}
if (JournalVoucherEntry.associate) {
  JournalVoucherEntry.associate({ JournalVoucher });
}

module.exports = {
  sequelize,
  JournalVoucher,
  JournalVoucherEntry,
  LedgerEntry,
  CashbookEntry,
}; 