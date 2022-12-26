module.exports = app => {
  const boms = require("../controllers/bom.controller.js");

  var routerBom = require("express").Router();

  // Create a new
  routerBom.post("/", boms.create);

  // Retrieve all
  routerBom.get("/", boms.findAll);

  // Retrieve all active
  routerBom.get("/products/:product", boms.findByProduct);

  // Retrieve all active
  routerBom.get("/aggrproducts", boms.findByProductAggr);

  // Retrieve a single
  routerBom.get("/:id", boms.findOne);

  // Update with id
  routerBom.put("/:id", boms.update);

  // Delete with id
  routerBom.delete("/:id", boms.delete);

  app.use("/api/boms", routerBom);
};