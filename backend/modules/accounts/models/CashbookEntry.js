module.exports = (sequelize, DataTypes) => {
  const CashbookEntry = sequelize.define('CashbookEntry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    particulars: DataTypes.STRING,
    debit: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0
    },
    credit: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0
    }
  }, {
    tableName: 'cashbook_entries',
    timestamps: false
  });

  return CashbookEntry;
}; 