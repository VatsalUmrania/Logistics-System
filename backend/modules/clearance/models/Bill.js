module.exports = (sequelize, DataTypes) => {
    const Bill = sequelize.define('Bill', {
      clientRef: DataTypes.STRING,
      doDate: DataTypes.DATEONLY,
      doNo: DataTypes.STRING,
      endorseNo: DataTypes.STRING,
      billNo: DataTypes.STRING
    }, {
      tableName: 'bills',
      timestamps: false
    });
  
    Bill.associate = models => {
      Bill.belongsTo(models.Operation, {
        foreignKey: 'operationId',
        as: 'operation'
      });
    };
  
    return Bill;
  };