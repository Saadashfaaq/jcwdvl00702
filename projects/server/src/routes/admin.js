const {
  models: { Customer, Approle },
} = require('../models');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const customer = require('../models/customer');
const { user } = require('../config/db-config');

//GET ALL USER
router.get('/get-user', async (req, res) => {
  try {
    const allUser = await Customer.findAll({
      include: [Approle],
    });
    return res.status(200).send({ allUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.toString() });
  }
});

//GET ONE USER
router.get('/get-user-one/:customer_uid', async (req, res) => {
  try {
    const result = await Customer.findOne({
      include: [Approle],
      where: {
        customer_uid: req.params.customer_uid,
      },
    });
    return res.status(200).send({ result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.toString() });
  }
});

//UPDATE USER
router.put('/update/:customer_uid', async (req, res) => {
  const customer_uid = req.params.customer_uid;
  try {
    await Customer.update(req.body, { where: { customer_uid } });
    const customer = await Customer.findOne({ customer_uid });
    return res.status(200).send({ message: 'updated' });
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
});

//UPDATE DETAIL USER
router.put("/update-detail/:customer_uid", async (req, res)=>{
    const customer_uid=req.params.customer_uid
    try{
        let dataUpdate = await Customer.update({
            email:req.body.email,
            fullname:req.body.fullname,
            // password:req.body.password,
        },
        {
            where:{customer_uid}
        }
        )
        const customer = await Customer.findOne({customer_uid})
        return res.status(200).send({message:"updated",data:dataUpdate})
    } catch(err){
        return res.status(500).json({message:err.toString()})
    }
})

//GET USER WITH PAGINATION
router.get('/pagination-user', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = 3;
    const search = req.query.search || '';
    const offset = limit * page;
    const productLength = await Product.findAll({});
    const sort = req.query.sort || 'id';

    const result = await Customer.findAll({
      include: [Approle],
      limit: limit,
      offset: page * limit,
      order: [[sort, 'ASC']],
      ...(req.query.search && {
        where: {
          name: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
      }),
    });
    const resultCount = await Customer.findAll({
      ...(req.query.search && {
        where: {
          name: {
            [Op.like]: `%${req.query.search}%`,
          },
        },
      }),
    });
    const pages = Math.ceil(resultCount.length / limit);

        res.status(200).json('sukses')
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;
