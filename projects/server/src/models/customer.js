const { BOOLEAN } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'customer',
    {
      // role: {
      //   allowNull: false,
      //   type: DataTypes.STRING,
      // },
      fullname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      is_verified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      // token: {
      //   allowNull: false,
      //   type: DataTypes.STRING,
      // },
      // expired_time: {
      //   allowNull: false,
      //   type: DataTypes.INTEGER,
      // },
      picture: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      is_banned: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      social_login: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      customer_uid: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      // approle_id: {
      //   allowNull: false,
      //   type: DataTypes.INTEGER,
      // },
    },
    {}
  );
  // Customer.associate = (models) => {
  //   Customer.hasMany(models.Address, { foreignKey: 'user_id' });
  //   Customer.hasOne(models.Cart, { foreignKey: 'user_id' });
  //   Customer.hasOne(models.Order, { foreignKey: 'user_id' });
  //   Customer.hasOne(models.Role, { foreignKey: 'user_id' });
  // };
  return Customer; //user
};
