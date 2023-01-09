const {
  models: { Warehouse },
} = require("../models");
const router = require("express").Router();
const request = require("request");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/warehouseimages/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// get provinsi
router.get("/provinces", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: "c74330bcc1e63a717708e5a61daef6f7" },
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
router.get("/cities", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      headers: { key: "c74330bcc1e63a717708e5a61daef6f7" },
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
router.get("/postal-code", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      headers: { key: "c74330bcc1e63a717708e5a61daef6f7" },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      res.json(body);
    });
  } catch (error) {
    console.log(error);
  }
});

// add warehouse
router.post("/add-new-warehouse", upload.single('picture'), async (req, res) => {
  try {
    const newWarehouse = new Warehouse({
      warehouse_name: req.body.warehouse_name,
      warehouse_address: req.body.warehouse_address,
      province: req.body.province,
      city: req.body.city,
      postal_code: req.body.postal_code,
      is_primary: false,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      picture: req.file.path,
      admin: req.body.admin,
      city_id: req.body.city_id,
    });
    const warehouse = await newWarehouse.save();
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get warehouse list
router.get("/warehouse-list", async (req, res) => {
  try {
    const response = await Warehouse.findAll();

    console.log("ini test", response.length)
    for(let i = 0; i<response.length; i++)
    {
      let picPathArray = response[i].picture.split("\\");
      let picPath =
        "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
      response[i].picture = picPath;
    }
    //  let picPathArray = response.picture.split("\\");
    //  let picPath =
    //    "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
    // //  response.picture = picPath;
    // console.log(picPath)
    // console.log(JSON.stringify(response.picture))
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// Get All WH Locations for choose address
router.get("/wh-all",async(req,res)=>{
  try{
    const result = await Warehouse.findAll()
    return res.status(200).send(result)
  } catch(err){
    return res.status(500).json({message:err.toString()})
  }
})

// get warehouse by city id
router.get('/wh-city-id', async (req, res) => {
  try {
    const response = await Warehouse.findOne({
      where: {
        city_id: req.body.city_id
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// get warehouse by id
router.get("/warehouse-list/:id", async (req, res) => {
  try {
    const response = await Warehouse.findOne({
      where: {
        id: req.params.id,
      },
    });
       let picPathArray = response.picture.split("\\");
       let picPath =
         "http://localhost:3300/" + picPathArray[1] + "/" + picPathArray[2];
       response.picture = picPath;
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

// update warehouse
router.put("/edit-warehouse/:id", upload.single('picture'), async (req, res) => {
  await Warehouse.findOne({
    where: {
      id: req.params.id,
    },
  });
  try {
    let updateWarehouse = await Warehouse.update(
      {
        warehouse_name: req.body.warehouse_name,
        warehouse_address: req.body.warehouse_address,
        province: req.body.province,
        city: req.body.city,
        postal_code: req.body.postal_code,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        picture: req.file.path,
        admin: req.body.admin
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({
      message: "Success",
      data: updateWarehouse,
    });
  } catch (error) {
    console.log(error);
  }
});

// post latitude longitude from city
router.post("/lat-long", async (req, res) => {
  try {
    const options = {
      method: "GET",
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
  router.delete("/delete-warehouse/:id", async (req, res) => {
    try {
      await Warehouse.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json({ message: "Warehouse Deleted" });
    } catch (error) {}
  });
});

module.exports = router;
