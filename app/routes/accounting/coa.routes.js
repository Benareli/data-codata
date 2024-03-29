module.exports = app => {
  const coas = require("../../controllers/accounting/coa.controller.js");

  var routerCoa = require("express").Router();

  // Retrieve all
  routerCoa.get("/", coas.findAll);

  // Retrieve a single
  routerCoa.get("/id/:id", coas.findOne);

  // Retrieve a single
  routerCoa.get("/active", coas.findActive);

  // Retrieve a single
  routerCoa.get("/prefix/:prefix", coas.findByPrefix);

  // Retrieve a single
  routerCoa.get("/type/:type", coas.findByType);

  app.use("/api/coas", routerCoa);
};