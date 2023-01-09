const {
  models: { Order, Cart, Product, Orderitem },
} = require("../models");

const { where, Op } = require("sequelize");
const router = require("express").Router();
const multer = require("multer");
const orderitem = require("../models/orderitem");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/productimages/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// ADD ORDER

router.post(`/add-order`, async (req, res) => {
  console.log("ini req body", req.body);
  try {
    const newOrder = await Order.create({
      customer_uid: req.body.customer_uid,
      fullname: req.body.fullname,
      cart_id: "",
      status: false,
      total_price: 0,
      shipping_price: 0,
      shipping_address: "",
      shipping_courier: "",
      payment_picture: "",
    });

    console.log("ini new Order:", newOrder);
    const order = await newOrder.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ORDER by id

router.get("/get-order/:id", async (req, res) => {
  try {
    const getOrder = await Order.findOne({
      where: {
        customer_uid: req.params.id,
        // status false ini berarti hanya orderan yg belum selesai saja yg dikirim ke frontend
        status: false,
      },
    });
    res.status(200).json(getOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// add Address shipping

router.put("/edit-address/:id", async (req, res) => {
  await Order.findOne({
    where: {
      customer_uid: req.params.id,
      status: false,
    },
  });

  try {
    let updateOrder = await Order.update(
      {
        shipping_address: req.body.shipping_address,
      },
      {
        where: {
          customer_uid: req.params.id,
          status: false,
        },
      }
    );
    res.status(201).json({
      message: "Success",
      data: updateOrder,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// add shipping dan shipping price

router.put("/edit-shipping/:id", async (req, res) => {
  await Order.findOne({
    where: {
      customer_uid: req.params.id,
      status: false,
    },
  });

  try {
    let updateOrder = await Order.update(
      {
        shipping_courier: req.body.shipping_courier,
        shipping_price: req.body.shipping_price,
      },
      {
        where: {
          customer_uid: req.params.id,
          status: false,
        },
      }
    );
    res.status(201).json({
      message: "Success",
      data: updateOrder,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Update Final Payment
router.put("/final-payment/:id", async (req, res) => {
  await Order.findOne({
    where: {
      customer_uid: req.params.id,
      status: false,
    },
  });

  try {
    let updatePay = await Order.update(
      {
        total_price: req.body.total_price,
      },
      {
        where: {
          customer_uid: req.params.id,
          status: false,
        },
      }
    );
    res.status(200).json({ message: "Success", data: updatePay });
  } catch (err) {
    console.log(err.message);
  }
});

// Update Final Payment
router.put('/final-payment/:id',async(req,res)=>{
  await Order.findOne({
    where:{
      customer_uid: req.params.id,
      status : false,
    }
  })

  try {
    let updatePay = await Order.update(
      {
        total_price : req.body.total_price,
      },
      {
        where:{
          customer_uid: req.params.id,
          status : false,
        }
      }
    )
    res.status(200).json({message:'Success',data:updatePay})
  } catch(err){
    console.log(err.message)
  }
})

// Upload Payment Proof

router.put(
  "/payment-proof/:id",
  upload.single("payment_picture"),
  async (req, res) => {
    await Order.findOne({
      where: {
        customer_uid: req.params.id,
        status: false,
      },
    });

    try {
      let updateOrder = await Order.update(
        {
          payment_picture: req.file.path,
        },
        {
          where: {
            customer_uid: req.params.id,
            status: false,
          },
        }
      );
      res.status(201).json({
        message: "Success",
        data: updateOrder,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
);

// mengambil data order, cart dan product berdasarkan customer id

router.get("/get-order-cart-product/:customer_uid", async (req, res) => {
  try {
    const getOrder = await Order.findOne({
      where: {
        customer_uid: req.params.customer_uid,
      },
      include: [
        {
          model: Orderitem,
          required: true,
          include: [
            {
              model: Product,
              // required: true,
            },
          ],
        },
      ],
    });

    let picPathArray = getOrder.payment_picture.split("\\");
    let picPath =
      "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
    getOrder.payment_picture = picPath;

    for (let j = 0; j < getOrder.orderitems.length; j++) {
      let picPathArrayJ = getOrder.orderitems[j].product.picture.split("\\");
      let picPathJ =
        "http://localhost:3300/" + picPathArrayJ[1] + "/" + picPathArrayJ[2];
      getOrder.orderitems[j].product.picture = picPathJ;
    }

    res.status(200).json(getOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// mengambil data order, cart dan product semua user

router.get("/get-order-cart-product", async (req, res) => {
  try {
    const getOrder = await Order.findAll({
      include: [
        {
          model: Orderitem,
          required: true,
          include: [
            {
              model: Product,
              // required: true,
            },
          ],
        },
      ],
    });

    for (let i = 0; i < getOrder.length; i++) {
      let picPathArray = getOrder[i].payment_picture.split("\\");
      let picPath =
        "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
      getOrder[i].payment_picture = picPath;

      for (let j = 0; j < getOrder[i].orderitems.length; j++) {
        let picPathArrayJ =
          getOrder[i].orderitems[j].product.picture.split("\\");
        let picPathJ =
          "http://localhost:3300/" + picPathArrayJ[1] + "/" + picPathArrayJ[2];
        getOrder[i].orderitems[j].product.picture = picPathJ;
      }
    }

    res.status(200).json(getOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all data order based on user

router.get("/get-order-cart-user-product/:customer_uid", async (req, res) => {
  try {
    const getOrder = await Order.findAll({
      where: {
        customer_uid: req.params.customer_uid,
      },
      include: [
        {
          model: Orderitem,
          required: true,
          include: [
            {
              model: Product,
              // required: true,
            },
          ],
        },
      ],
    });

    for (let i = 0; i < getOrder.length; i++) {
      let picPathArray = getOrder[i].payment_picture.split("\\");
      let picPath =
        "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
      getOrder[i].payment_picture = picPath;

      for (let j = 0; j < getOrder[i].orderitems.length; j++) {
        let picPathArrayJ =
          getOrder[i].orderitems[j].product.picture.split("\\");
        let picPathJ =
          "http://localhost:3300/" + picPathArrayJ[1] + "/" + picPathArrayJ[2];
        getOrder[i].orderitems[j].product.picture = picPathJ;
      }
    }

    res.status(200).json(getOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
