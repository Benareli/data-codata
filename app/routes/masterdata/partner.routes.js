module.exports = app => {
  const partners = require("../../controllers/masterdata/partner.controller.js");

  var routerPartner = require("express").Router();

  // Create a new
  routerPartner.post("/", partners.create);

  // Create a new
  routerPartner.post("/many", partners.createMany);

  // Retrieve all
  routerPartner.get("/", partners.findAll);

  // Retrieve all active
  routerPartner.get("/active", partners.findAllActive);

  // Retrieve all customer
  routerPartner.get("/customer", partners.findAllCustomer);

  // Retrieve all supplier
  routerPartner.get("/supplier", partners.findAllSupplier);

  // Retrieve all active customer
  routerPartner.get("/activecustomer", partners.findAllActiveCustomer);

  // Retrieve all active supplier
  routerPartner.get("/activesupplier", partners.findAllActiveSupplier);

  // Retrieve a single
  routerPartner.get("/:id", partners.findOne);

  // Update with id
  routerPartner.put("/:id", partners.update);

  app.use("/api/partners", routerPartner);
};