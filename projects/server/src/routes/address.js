const {
  models: { Address },
} = require('../models');
const router = require('express').Router();
const request = require('request');

// get provinsi
router.get('/provinces', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/province',
      headers: { key: 'c74330bcc1e63a717708e5a61daef6f7' },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body);
    });
  } catch (error) {
    console.log(error);
  }
});

//get city
router.get('/cities', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/city',
      headers: { key: 'c74330bcc1e63a717708e5a61daef6f7' },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body);
    });
  } catch (error) {
    console.log(error);
  }
});

// get postal code
router.get('/postal-code', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://api.rajaongkir.com/starter/city',
      headers: { key: 'c74330bcc1e63a717708e5a61daef6f7' },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body);
    });
  } catch (error) {
    console.log(error);
  }
});

// add address
router.post('/add-new-address', async (req, res) => {
  try {
    const newAddress = new Address({
      address_name: req.body.address_name,
      address: req.body.address,
      province: req.body.province,
      city: req.body.city,
      postal_code: req.body.postal_code,
      is_primary: false,
      customer_uid: req.body.customer_uid,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      city_id: req.body.city_id,
    });
    const address = await newAddress.save();
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get address by customer_uid
router.get('/address-list/:customer_uid', async (req, res) => {
  try {
    const response = await Address.findAll({
      where: {
        customer_uid: req.params.customer_uid,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// get address by id
router.get('/address-list/:customer_uid/:id', async (req, res) => {
  try {
    const response = await Address.findOne({
      where: {
        customer_uid: req.params.customer_uid,
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// get address by city id
router.get('/address-city-id/:city_id', async (req, res) => {
  try {
    const response = await Address.findOne({
      where: {
        city_id: req.params.city_id
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// update address
router.put('/edit-address/:customer_uid/:id', async (req, res) => {
  await Address.findOne({
    where: {
      id: req.params.id,
      customer_uid: req.params.customer_uid,
    },
  });
  try {
    let updateAddress = await Address.update(
      {
        address_name: req.body.address_name,
        address: req.body.address,
        province: req.body.province,
        city: req.body.city,
        postal_code: req.body.postal_code,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({
      message: 'Success',
      data: updateAddress,
    });
  } catch (error) {
    console.log(error);
  }
});

// post latitude longitude from city
router.post('/lat-long', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://api.opencagedata.com/geocode/v1/json?q=${req.body.city}&key=c4e13262d8e24d78b12cbbaee4ba9f39`,
    };
    console.log(options);
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error);
  }

  // delete address
  router.delete('/delete-address/:customer_uid/:id', async (req, res) => {
    try {
      await Address.destroy({
        where: {
          customer_uid: req.params.customer_uid,
          id: req.params.id,
        },
      });
      res.json({ message: 'Address Deleted' });
    } catch (error) {}
  });
});

// Get Ongkir 
router.post("/ongkir-type",async(req,res)=>{
  try{
    const options={
      method: 'POST',
      url: 'https://api.rajaongkir.com/starter/cost',
      headers: {key: 'e1517d3ccf2f24ed5cb7e65082d5697e'},
      form: {origin: req.body.origin, destination: req.body.destination, weight: 1700, courier: req.body.courier}
    }
    //both origin and destinations use city ID
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body)
    })
  } catch(err){
    console.log(err)
  }
})

// // Get Warehouse Location ID
// router.get("/wh-loc/:address",async(req,res)=>{
//   try{
//     const result = await Warehouse.findOne({
//       where:{
//         address:req.params.address
//       }
//     })
//     return res.status(200).send(result)
//   } catch(err){
//     return res.status(500).json({message:err.toString()})
//   }
// })

module.exports = router;
