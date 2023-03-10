module.exports = app => {
  const bundles = require("../../controllers/masterdata/bundle.controller.js");

  var routerBundle = require("express").Router();

  // Create a new
  routerBundle.post("/", bundles.create);

  // Retrieve all
  routerBundle.get("/", bundles.findAll);

  // Retrieve by product
  routerBundle.get("/product/:product", bundles.findByProduct);

  // Retrieve by bundle
  routerBundle.get("/bundle/:bundle", bundles.findByBundle);

  // Retrieve a single
  routerBundle.get("/:id", bundles.findOne);

  // Update with id
  routerBundle.put("/:id", bundles.update);
  
  // Delete with id
  routerBundle.delete("/:id", bundles.delete);

  app.use("/api/bundles", routerBundle);
};