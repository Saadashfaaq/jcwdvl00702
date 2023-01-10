module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      quantity_total: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      product_detail: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      category_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      picture: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {}
  );
  Product.associate = (models) => {
    Product.hasMany(models.Stock, { foreignKey: 'product_id' });
  };
  return Product;
};
