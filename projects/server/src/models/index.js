const dbConfig = require("../config/db-config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.Customer = require("./customer")(sequelize, Sequelize.DataTypes);
db.models.Address = require("./address")(sequelize, Sequelize.DataTypes);
db.models.Cart = require("./cart")(sequelize, Sequelize.DataTypes);
db.models.Order = require("./order")(sequelize, Sequelize.DataTypes);
db.models.Shipping = require("./shipping")(sequelize, Sequelize.DataTypes);
db.models.Sales = require("./sales")(sequelize, Sequelize.DataTypes);
db.models.Warehouse = require("./warehouse")(sequelize, Sequelize.DataTypes);
db.models.Admin = require("./admin")(sequelize, Sequelize.DataTypes);
db.models.Stockmutation = require("./stockmutation")(
  sequelize,
  Sequelize.DataTypes
);
db.models.Stockhistory = require("./stockhistory")(
  sequelize,
  Sequelize.DataTypes
);
db.models.Product = require("./product")(sequelize, Sequelize.DataTypes);
db.models.Transaction = require("./transaction")(
  sequelize,
  Sequelize.DataTypes
);
db.models.History = require("./history")(sequelize, Sequelize.DataTypes);
db.models.Orderitem = require("./orderitem")(sequelize, Sequelize.DataTypes);
db.models.Role = require("./role")(sequelize, Sequelize.DataTypes);
db.models.Example = require("./example")(sequelize, Sequelize.DataTypes);
db.models.Stock = require("./stock")(sequelize, Sequelize.DataTypes);

db.models.Customer.hasMany(db.models.Address, {
  foreignKey: "customer_uid",
  sourceKey: "customer_uid",
});
db.models.Address.belongsTo(db.models.Customer, {
  foreignKey: "customer_uid",
});

//close

// db.models.Product.hasMany(db.models.Warehouse, {
//   foreignKey: 'warehouse_id',
// });

db.models.Product.hasMany(db.models.Stock, {
  foreignKey: "product_id",
});

db.models.Stock.hasMany(db.models.Stockmutation, {
  foreignKey: "stock_id",
});
db.models.Stockmutation.belongsTo(db.models.Stock, {
  foreignKey: "stock_id",
});

//close

// db.models.Customer.hasMany(db.models.Warehouse, {
//   foreignKey: 'customer_uid',
//   sourceKey: 'customer_uid',
// });
// db.models.Warehouse.belongsTo(db.models.Customer, {
//   foreignKey: 'customer_uid',
// });

db.models.Customer.hasMany(db.models.Address, {
  foreignKey: "customer_uid",
  sourceKey: "customer_uid",
});
db.models.Address.belongsTo(db.models.Customer, {
  foreignKey: "customer_uid",
});
db.models.Product.hasMany(db.models.Cart, {
  foreignKey: "product_id",
  // sourceKey:"cart_id",
});
db.models.Cart.belongsTo(db.models.Product, {
  foreignKey: "product_id",
});
db.models.Order.hasMany(db.models.Orderitem, {
  foreignKey: "order_id",
});
db.models.Orderitem.belongsTo(db.models.Order, {
  foreignKey: "order_id",
});
db.models.Product.hasMany(db.models.Orderitem, {
  foreignKey: "product_id",
});
db.models.Orderitem.belongsTo(db.models.Product, {
  foreignKey: "product_id",
});

module.exports = db;
