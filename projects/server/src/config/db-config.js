const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

module.exports = {
  env: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: process.env.DB_CONNECTION,
  },
};

// module.exports = {
//   host: `localhost`,
//   user: `root`,
//   password: `jcwdvl07`,
//   database: `db_ecom`,

//   // host: `localhost`,
//   // user: `root`,
//   // password: `rootpass`,
//   // database: `db_ecom`,

//   // host: '127.0.0.1',
//   // user: 'root',
//   // password: 'password',
//   // database: 'db_ecom',

//   port: 3306,
//   multipleStatements: true,
//   dialect: 'mysql',
// };
