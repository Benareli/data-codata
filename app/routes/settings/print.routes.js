module.exports = app => {
  const prints = require("../../controllers/settings/print.controller.js");

  var routerPrint = require("express").Router();

  // Create a new
  routerPrint.post("/", prints.create);

  // Retrieve all
  routerPrint.get("/", prints.findAll);

  // Retrieve all
  routerPrint.get("/det/:mod/:comp", prints.findByDet);

  // Retrieve a single
  routerPrint.get("/:id", prints.findOne);

  // Update with id
  routerPrint.put("/:id", prints.update);

  app.use("/api/prints", routerPrint);
};