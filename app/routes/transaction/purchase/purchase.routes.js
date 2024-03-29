module.exports = app => {
  const purchases = require("../../../controllers/transaction/purchase/purchase.controller.js");

  var routerPur = require("express").Router();

  // Create a new
  routerPur.post("/", purchases.create);

  // Retrieve all
  routerPur.get("/", purchases.findAll);

  // Retrieve all
  routerPur.get("/comp/:comp", purchases.findAllByComp);

  // Retrieve a single
  routerPur.get("/:id", purchases.findOne);

  // Update with id
  routerPur.put("/:id", purchases.update);

  // Update with id
  routerPur.get("/state/:id/:state", purchases.updateState);

  app.use("/api/purchases", routerPur);
};