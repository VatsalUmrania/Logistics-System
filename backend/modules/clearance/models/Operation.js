module.exports = (sequelize, DataTypes) => {
    const Operation = sequelize.define('Operation', {
      operationType: {
        type: DataTypes.ENUM('Import', 'Export'),
        allowNull: false
      },
      transportMode: {
        type: DataTypes.ENUM('Land', 'Air', 'Sea'),
        allowNull: false
      },
      client: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jobNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      commodity: DataTypes.STRING,
      noOfPackages: DataTypes.INTEGER,
      pod: DataTypes.STRING,
      line: DataTypes.STRING,
      vessel: DataTypes.STRING,
      netWeight: DataTypes.FLOAT,
      grossWeight: DataTypes.FLOAT,
      shipper: DataTypes.STRING,
      clientRefName: DataTypes.STRING,
      lineAgent: DataTypes.STRING,
      representative: DataTypes.STRING,
      receivingRep: DataTypes.STRING,
      pol: DataTypes.STRING,
      bayanNo: DataTypes.STRING,
      bayanDate: DataTypes.DATEONLY,
      paymentDate: DataTypes.DATEONLY,
      group: DataTypes.STRING,
      eta: DataTypes.DATEONLY,
      date: DataTypes.DATEONLY,
      yardDate: DataTypes.DATEONLY,
      hijriDate: DataTypes.STRING,
      endDate: DataTypes.DATEONLY,
      releaseDate: DataTypes.DATEONLY,
      status: DataTypes.STRING,
      notes: DataTypes.TEXT,
      bl: DataTypes.STRING,
      poNo: DataTypes.STRING
    }, {
      tableName: 'operations',
      timestamps: true
    });
  
    Operation.associate = models => {
      Operation.hasMany(models.Container, { 
        foreignKey: 'operationId',
        as: 'containers',
        onDelete: 'CASCADE'
      });
      Operation.hasMany(models.Bill, { 
        foreignKey: 'operationId',
        as: 'bills',
        onDelete: 'CASCADE'
      });
    };
  
    return Operation;
  };