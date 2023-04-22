module.exports = app => {
  const sales = require("../../../controllers/transaction/sale/sale.controller.js");

  var routerSal = require("express").Router();

  // Create a new
  routerSal.post("/", sales.create);

  // Retrieve all
  routerSal.get("/", sales.findAll);

  // Retrieve all
  routerSal.get("/comp/:comp", sales.findAllByComp);

  // Retrieve a single
  routerSal.get("/:id", sales.findOne);

  // Update with id
  routerSal.put("/:id", sales.update);

  // Update with id
  routerSal.get("/state/:id/:state", sales.updateState);

  app.use("/api/sales", routerSal);
};