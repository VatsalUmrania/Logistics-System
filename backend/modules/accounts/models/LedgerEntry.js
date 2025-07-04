module.exports = (sequelize, DataTypes) => {
  const LedgerEntry = sequelize.define('LedgerEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    description: DataTypes.STRING,
    voucher_no: DataTypes.STRING,
    debit: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0
    },
    credit: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'ledger_entries',
    timestamps: false
  });

  return LedgerEntry;
}; 