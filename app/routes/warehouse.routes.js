module.exports = app => {
  const warehouses = require("../controllers/warehouse.controller.js");

  var routerWh = require("express").Router();

  // Create a new
  routerWh.post("/", warehouses.create);

  // Create a new
  routerWh.post("/many", warehouses.createMany);

  // Retrieve all
  routerWh.get("/", warehouses.findAll);

  // Retrieve all active
  routerWh.get("/active", warehouses.findAllActive);

  // Retrieve all active
  routerWh.get("/main", warehouses.findMain);

  // Retrieve a single
  routerWh.get("/:id", warehouses.findOne);

  // Update with id
  routerWh.put("/:id", warehouses.update);

  app.use("/api/warehouses", routerWh);
};