module.exports = app => {
  const brands = require("../controllers/brand.controller.js");

  var routerBrand = require("express").Router();

  // Create a new
  routerBrand.post("/", brands.create);

  // Create a new
  routerBrand.post("/many", brands.createMany);

  // Retrieve all
  routerBrand.get("/", brands.findAll);

  // Retrieve all active
  routerBrand.get("/active", brands.findAllActive);

  // Retrieve a single
  routerBrand.get("/:id", brands.findOne);

  // Update with id
  routerBrand.put("/:id", brands.update);

  app.use("/api/brands", routerBrand);
};