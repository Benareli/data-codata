module.exports = app => {
    const paymentmethods = require("../../controllers/accounting/paymentmethod.controller.js");
  
    var routerPayM = require("express").Router();
  
    // Create a new
    routerPayM.post("/", paymentmethods.create);
  
    // Retrieve all
    routerPayM.get("/", paymentmethods.findAll);
  
    // Retrieve a single
    routerPayM.get("/:id", paymentmethods.findOne);

    // Retrieve a single
    routerPayM.get("/name/:name", paymentmethods.findByDesc);
  
    // Update with id
    routerPayM.put("/:id", paymentmethods.update);
  
    app.use("/api/paymentmethods", routerPayM);
  };