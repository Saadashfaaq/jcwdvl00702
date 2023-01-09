const {
    models: { Orderitem },
  } = require('../models');

const { where, Op } = require('sequelize');
const router = require('express').Router();

  // ADD orderitems

  router.post(`/add-orderitem`, async (req, res) =>{
    console.log("ini req.body", req.body)
    try {
            const newOrderitem = await Orderitem.create({
                order_id: req.body.order_id,
                product_id: req.body.product_id,
                warehouse_id: req.body.warehouse_id,
                quantity: req.body.quantity
              });
              console.log('ini new Cart:', newOrderitem);
              const orderitem = await newOrderitem.save()
              res.status(200).json(orderitem);
    } catch (err) {
        res.status(500).json(err);
    }
  })



module.exports = router;