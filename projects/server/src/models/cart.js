module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "cart",
    {
      customer_uid: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fullname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      product_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {}
  );
  Cart.associate = (models) => {
    Cart.hasOne(models.Order, { foreignKey: "cart_id" });
    Cart.hasMany(models.Product, { foreignKey: "cart_id" });
  };
  return Cart;
};
