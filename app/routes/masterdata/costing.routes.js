module.exports = app => {
  const costs = require("../../controllers/masterdata/costing.controller.js");

  var routerCost = require("express").Router();

  // Create a new
  routerCost.post("/", costs.create);

  // Retrieve all
  routerCost.get("/", costs.findAll);

  // Retrieve all active
  routerCost.get("/products/:product", costs.findByProduct);

  // Retrieve a single
  routerCost.get("/:id", costs.findOne);

  // Update with id
  routerCost.put("/:id", costs.update);

  // Delete with id
  routerCost.delete("/:id", costs.delete);

  app.use("/api/costings", routerCost);
};