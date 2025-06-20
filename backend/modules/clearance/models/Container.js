module.exports = (sequelize, DataTypes) => {
    const Container = sequelize.define('Container', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('20GP', '40GP', '40HC', '45HC', '20RF', '40RF'),
        allowNull: false
      }
    }, {
      tableName: 'containers',
      timestamps: false
    });
  
    Container.associate = models => {
      Container.belongsTo(models.Operation, {
        foreignKey: 'operationId',
        as: 'operation'
      });
    };
  
    return Container;
  };