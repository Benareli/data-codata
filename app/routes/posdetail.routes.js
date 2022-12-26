module.exports = app => {
  const posdetails = require("../controllers/posdetail.controller.js");

  var routerPosDet = require("express").Router();

  // Create a new
  routerPosDet.post("/", posdetails.create);

  // Retrieve all
  routerPosDet.get("/", posdetails.findAll);

  // Retrieve a single
  //routerPosDet.get("/:id", posdetails.findOne);

  // Retrieve all
  routerPosDet.get("/product/:product", posdetails.findByProduct);

  // Update with id
  routerPosDet.put("/:id", posdetails.update);

  //Report
  routerPosDet.get("/report", posdetails.report);

  app.use("/api/posdetails", routerPosDet);
};