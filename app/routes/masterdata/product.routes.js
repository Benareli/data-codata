module.exports = app => {
  const products = require("../../controllers/masterdata/product.controller.js");

  var routerProduct = require("express").Router();

  // Create a new
  routerProduct.post("/", products.create);

  // Create a new
  routerProduct.post("/many", products.createMany);

  // Retrieve all
  routerProduct.get("/all/:comp", products.findAll);

  // Retrieve all active
  routerProduct.get("/active/:comp", products.findAllActive);

  // Retrieve all stock
  routerProduct.get("/stock/:comp", products.findAllStock);

  // Retrieve all active stock
  routerProduct.get("/activestock/:comp", products.findAllActiveStock);

  // Retrieve all ready stock
  routerProduct.get("/ready/:comp", products.findAllReady);

  // Retrieve all inactive fg
  routerProduct.get("/fgready/:comp", products.findAllFGStock);

  // Retrieve all inactive fg
  routerProduct.get("/rmready/:comp", products.findAllRMStock);

  // Retrieve all inactive fg
  routerProduct.get("/rmtrue/:comp", products.findAllRMTrue);

  // Retrieve all rm
  routerProduct.get("/rm/:comp", products.findAllRM);

  // Retrieve all PO ready
  routerProduct.get("/poready/:comp", products.findAllPOReady);

  // Retrieve all PO ready
  routerProduct.get("/soready/:comp", products.findAllSOReady);

  // Get Cost Company
  routerProduct.get("/costcomp/:prod/:comp", products.getCostComp);

  // Retrieve a single
  routerProduct.get("/:id", products.findOne);

  // Update with id
  routerProduct.put("/:id", products.update);

  app.use("/api/products", routerProduct);
};