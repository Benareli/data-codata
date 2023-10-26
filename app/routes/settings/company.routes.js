module.exports = app => {
  const companys = require("../../controllers/settings/company.controller.js");

  var routerCompany = require("express").Router();

  // Retrieve all
  routerCompany.get("/", companys.findAll);

  // Retrieve all
  routerCompany.get("/get/:id", companys.findOne);

  // Update with id
  routerCompany.put("/:id", companys.update);

  app.use("/api/companys", routerCompany);
};