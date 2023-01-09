const express = require(`express`);
const cors = require(`cors`);
const db = require('./models');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const customerRoute = require('./routes/customer');
const adminRoute = require('./routes/admin');
const productRoute = require('./routes/product');
const addressRoute = require('./routes/address');
const warehouseRoute = require('./routes/warehouse');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const orderItemRoute = require("./routes/orderitem")

const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();
const PORT = 3300;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/profileimages', express.static(path.join(__dirname, '../public/profileimages')));
app.use('/productimages', express.static(path.join(__dirname, '../public/productimages')));
app.use('/warehouseimages', express.static(path.join(__dirname, '../public/warehouseimages')));
app.use('/orderimages', express.static(path.join(__dirname, '../public/orderimages')));

(async () => {
  await db.sequelize.sync();
})();

app.use('/api/customer', customerRoute);
app.use('/api/admin', adminRoute);
app.use('/api/product', productRoute);
app.use('/api/address', addressRoute);
app.use('/api/warehouse', warehouseRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use("/api/orderitem", orderItemRoute)

app.listen(PORT, () => console.log(`API running:`, PORT));
