module.exports = (sequelize, DataTypes) => {
  const Stockhistory = sequelize.define(
    'stockhistory',
    {
      stock_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      stockmutation_id: {
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
      math: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      start: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      end: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      requester: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      year: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      month: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {}
  );
  return Stockhistory;
};
