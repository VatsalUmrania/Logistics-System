module.exports = (sequelize, DataTypes) => {
  const JournalVoucher = sequelize.define('JournalVoucher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voucher_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  }, {
    tableName: 'journal_vouchers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  JournalVoucher.associate = (models) => {
    JournalVoucher.hasMany(models.JournalVoucherEntry, {
      foreignKey: 'voucher_id',
      as: 'entries'
    });
  };

  return JournalVoucher;
};