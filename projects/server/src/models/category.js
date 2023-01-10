module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'category',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      alt_name: {
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
  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: 'category_id' });
  };
  return Category;
};
