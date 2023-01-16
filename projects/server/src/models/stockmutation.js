module.exports = (sequelize, DataTypes) => {
  const Stockmutation = sequelize.define(
    'stockmutation',
    {
      stock_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      warehouse_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      product_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      product_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      product_picture: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      requester: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      move_type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {}
  );
  return Stockmutation;
};
