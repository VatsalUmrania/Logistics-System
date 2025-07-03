module.exports = (sequelize, DataTypes) => {
  const JournalVoucherEntry = sequelize.define('JournalVoucherEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'journal_vouchers',
        key: 'id'
      }
    },
    debit_account_head_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    debit_account_subhead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    credit_account_head_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    credit_account_subhead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    remarks: DataTypes.TEXT
  }, {
    tableName: 'journal_voucher_entries',
    timestamps: false
  });

  JournalVoucherEntry.associate = (models) => {
    JournalVoucherEntry.belongsTo(models.JournalVoucher, {
      foreignKey: 'voucher_id',
      as: 'voucher'
    });
  };

  return JournalVoucherEntry;
};