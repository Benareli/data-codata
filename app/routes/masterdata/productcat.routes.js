module.exports = app => {
  const productcats = require("../../controllers/masterdata/productcat.controller.js");

  var routerProductCat = require("express").Router();

  // Create a new
  routerProductCat.post("/", productcats.create);

  // Create a new
  routerProductCat.post("/many", productcats.createMany);
  
  // Retrieve all
  routerProductCat.get("/", productcats.findAll);

  // Retrieve all active
  routerProductCat.get("/active", productcats.findAllActive);

  // Retrieve a single
  routerProductCat.get("/:id", productcats.findOne);

  // Retrieve a single with acc
  routerProductCat.get("/acc/:id/:company", productcats.findOneAcc);

  // Update with id
  routerProductCat.put("/:id", productcats.update);

  app.use("/api/productcats", routerProductCat);
};