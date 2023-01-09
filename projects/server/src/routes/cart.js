const {
  models: { Cart, Product },
} = require("../models");

const { where, Op } = require("sequelize");
const router = require("express").Router();
const cart = require(`../models/cart`);

// ADD Cart

router.post(`/add-to-cart`, async (req, res) => {
  try {
    const newCart = await Cart.create({
      customer_uid: req.body.customer_uid,
      fullname: req.body.fullname,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    });
    console.log("ini new Cart:", newCart);
    const cart = await newCart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Cart By Customer UID

router.get("/get-cart/:id", async (req, res) => {
  try {
    const getCart = await Cart.findAll({
      where: {
        customer_uid: req.params.id,
      },
    });
    res.status(200).json(getCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete cart

router.delete("/delete-cart-customer/:id", async (req, res) => {
  try {
    console.log("ini id", req.params.id);

    const customer_uid = req.params.id;
    const deleteCart = await Cart.destroy({
      where: {
        customer_uid,
      },
    });
    res.status(200).json(deleteCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add Quantity product di product detail

router.put("/edit-cart/:id", async (req, res) => {
  await Cart.findOne({
    where: {
      product_id: req.params.id,
      customer_uid: req.body.customer_uid,
    },
  });

  try {
    let getQtyCart = await Cart.findOne({
      where: {
        product_id: req.params.id,
        customer_uid: req.body.customer_uid,
      },
    });

    let totalQty = getQtyCart.quantity + req.body.quantity;
    console.log("ini total quantity:", totalQty);

    let updateCart = await Cart.update(
      {
        quantity: totalQty,
      },
      {
        where: {
          product_id: req.params.id,
          customer_uid: req.body.customer_uid,
        },
      }
    );
    res.status(201).json({
      message: "Success",
      data: updateCart,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// mengambil product yang telah dimasukan ke dalam cart berdasarkan customer uid


router.get("/get-cart-product/:id", async (req, res) => {
  try {
    const getProduct = await Cart.findAll({
      where: {
        customer_uid: req.params.id,
      },
      include: [
        {
          model: Product,
          required: true,
        },
      ],
    });

    for (let i = 0; i < getProduct.length; i++) {
      let picPathArray = getProduct[i].product.picture.split("\\");
      let picPath =
        "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
      getProduct[i].product.picture = picPath;
    }

    res.status(200).json(getProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});


// add / min quantity di cart
router.put("/edit-qty/:id", async (req, res) => {
  await Cart.findOne({
    where: {
      id: req.params.id,
      customer_uid: req.body.customer_uid,
    },
  });

  try {
    let getQtyCart = await Cart.findOne({
      where: {
        id: req.params.id,
        customer_uid: req.body.customer_uid,
      },
    });

    if (req.body.action === "add") {
      let totalQty = getQtyCart.quantity + 1;
      let updateCart = await Cart.update(
        {
          quantity: totalQty,
        },
        {
          where: {
            id: req.params.id,
            customer_uid: req.body.customer_uid,
          },
        }
      );
      res.status(201).json({
        message: "Success",
        data: updateCart,
      });
    } else if (req.body.action === "min") {
      let totalQty = getQtyCart.quantity - 1;
      let updateCart = await Cart.update(
        {
          quantity: totalQty,
        },
        {
          where: {
            id: req.params.id,
            customer_uid: req.body.customer_uid,
          },
        }
      );
      res.status(201).json({
        message: "Success",
        data: updateCart,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//menghitung total harga pada cart

router.get("/get-total-price/:id", async (req, res) => {
  try {
    const getProduct = await Cart.findAll({
      where: {
        customer_uid: req.params.id,
      },
      include: [
        {
          model: Product,
          required: true,
        },
      ],
    });

    let totalPrice = 0;
    for (let i = 0; i < getProduct.length; i++) {
      let pricePerItem = getProduct[i].product.price * getProduct[i].quantity;
      totalPrice += pricePerItem;
    }

    res.status(200).json(totalPrice);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
