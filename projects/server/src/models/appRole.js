module.exports = (sequelize, DataTypes) => {
    const Approle = sequelize.define(
      'approle',
      {
        customer_uid: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        role:{
            allowNull: false,
            type: DataTypes.STRING,
        },
        warehouse_id:{
            type: DataTypes.INTEGER,
        }
      },
      {}
    );
    return Approle;
  };
  