const {
  models: { Order, Cart, Product, Orderitem, Stock, Stockhistory },
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
      status_detail:0,
      total_price: 0,
      shipping_price: 0,
      shipping_address: "",
      shipping_courier: "",
      payment_picture: "",
      warehouse_id:"",
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
        status_detail: 0
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
        warehouse_id: req.body.warehouse_id
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
          status_detail: 1
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
      "http://localhost:8000/" + picPathArray[1] + "/" + picPathArray[2];
    getOrder.payment_picture = picPath;

    for (let j = 0; j < getOrder.orderitems.length; j++) {
      let picPathArrayJ = getOrder.orderitems[j].product.picture.split("\\");
      let picPathJ =
        "http://localhost:8000/" + picPathArrayJ[1] + "/" + picPathArrayJ[2];
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
        "http://localhost:8000/" + picPathArray[1] + "/" + picPathArray[2];
      getOrder[i].payment_picture = picPath;

      for (let j = 0; j < getOrder[i].orderitems.length; j++) {
        let picPathArrayJ =
          getOrder[i].orderitems[j].product.picture.split("\\");
        let picPathJ =
          "http://localhost:8000/" + picPathArrayJ[1] + "/" + picPathArrayJ[2];
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
        "http://localhost:8000/" + picPathArray[1] + "/" + picPathArray[2];
      getOrder[i].payment_picture = picPath;

      for (let j = 0; j < getOrder[i].orderitems.length; j++) {
        let picPathArrayJ =
          getOrder[i].orderitems[j].product.picture.split("\\");
        let picPathJ =
          "http://localhost:8000/" + picPathArrayJ[1] + "/" + picPathArrayJ[2];
        getOrder[i].orderitems[j].product.picture = picPathJ;
      }
    }

    res.status(200).json(getOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Approve Reject and Send
router.put('/approve-reject-send/:id',async(req,res)=>{
  console.log("ini req body",req.body)
  await Order.findOne({
    where:{
      customer_uid: req.params.id,
      status : false,
    }
  })

  try {
    let updateStatusDetail = await Order.update(
      {
        status_detail : req.body.status_detail,
      },
      {
        where:{
          customer_uid: req.params.id,
          status : false,
        }
      }
    )
    res.status(200).json({message:'Success',data:updateStatusDetail})
  } catch(err){
    console.log(err.message)
  }
})
// Received Order 
router.put('/received/:id',async(req,res)=>{
  console.log("ini req body",req.body)
  await Order.findOne({
    where:{
      customer_uid: req.params.id,
      status : false,
    }
  })

  try {
    let updateStatusDetail = await Order.update(
      {
        status_detail : req.body.status_detail,
        status: true
      },
      {
        where:{
          customer_uid: req.params.id,
          status : false,
        }
      }
    )
    res.status(200).json({message:'Success',data:updateStatusDetail})
  } catch(err){
    console.log(err.message)
  }
})

// cancel order
router.put('/cancel-order/:id', async(req,res)=> {
  let orderData = await Order.findOne({
    where: {
      // customer_uid: req.params.customer_uid,
      id: req.params.id,
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
  try {
    let updateStatusDetail = await Order.update(
      {
        status_detail: req.body.status_detail,
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    res.status(200).json({message:"Success", data: orderData})
  } catch (error) {
    console.log(error.message)
  }
})

// get back stock after cancel
router.patch("/update-stock/:id", async (req, res) => {
  const theProduct = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  const theStock = await Stock.findOne({
    where: {
      warehouse_id: req.body.wh_id,
      product_id: req.params.id,
    },
  });
  const theDate = new Date();

  try {
      const updateStock = await Product.update(
        {
          quantity_total: theProduct.quantity_total + parseInt(req.body.number),
        },
        {
          where: {
            id: req.params.id,
          },
          returning: true,
          plain: true,
        }
      );
      const changeStock = await Stock.update(
        {
          quantity: theStock.quantity + parseInt(req.body.number),
        },
        {
          where: {
            warehouse_id: req.body.wh_id,
            product_id: req.params.id,
          },
          returning: true,
          plain: true,
        }
      );
      const newMutation = await Stockhistory.create({
        stock_id: theStock.id,
        stockmutation_id: "return_stock",
        warehouse_id: theStock.warehouse_id,
        product_id: theStock.product_id,
        product_name: theProduct.name,
        product_picture: theProduct.picture,
        math: "+",
        quantity: parseInt(req.body.number),
        start: theStock.quantity,
        end: parseInt(theStock.quantity) + parseInt(req.body.number),
        requester: "super_admin",
        year: theDate.getFullYear(),
        month: theDate.getMonth() + 1,
      });

      const endStock = await Stock.findOne({
        where: {
          warehouse_id: req.body.wh_id,
          product_id: req.params.id,
        },
      });

    res.status(201).json(endStock.dataValues.quantity);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;