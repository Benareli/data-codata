module.exports = app => {
  const companys = require("../controllers/company.controller.js");

  var routerCompany = require("express").Router();

  // Retrieve all
  routerCompany.get("/", companys.findAll);

  // Update with id
  routerCompany.put("/:id", companys.update);

  app.use("/api/companys", routerCompany);
};