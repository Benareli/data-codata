module.exports = app => {
  const lots = require("../../controllers/masterdata/lot.controller.js");

  var routerLot = require("express").Router();

  // Create a new
  routerLot.post("/", lots.create);

  // Retrieve all
  routerLot.get("/", lots.findAll);

  // Retrieve a single
  routerLot.get("/id/:id", lots.findOne);
  
  // Retrieve a single
  routerLot.get("/whlot/:warehouse/", lots.findByWh);

  app.use("/api/lots", routerLot);
};