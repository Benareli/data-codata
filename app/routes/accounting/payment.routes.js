module.exports = app => {
  const payments = require("../../controllers/accounting/payment.controller.js");

  var routerPay = require("express").Router();

  // Create a new
  routerPay.post("/", payments.create);

  // Retrieve all
  routerPay.get("/", payments.findAll);

  // Retrieve a single
  routerPay.get("/:id", payments.findOne);

  // Update with id
  routerPay.put("/:id", payments.update);

  app.use("/api/payments", routerPay);
};