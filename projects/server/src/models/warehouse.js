const { BOOLEAN } = require("sequelize");
const { Customer } = require("./customer");
module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define(
    "warehouse",
    {
      warehouse_address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      warehouse_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      province: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      postal_code: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
      },
      admin: {
        type: DataTypes.STRING
      },
      city_id: {
        type: DataTypes.STRING,
      },
      is_primary: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {}
  );
  return Warehouse;
};
