module.exports = app => {
  const roles = require("../controllers/userrole.controller.js");

  var routerRole = require("express").Router();

  // Retrieve all
  routerRole.get("/", roles.findAll);

  // Retrieve a single
  routerRole.get("/:id", roles.findOne);

  app.use("/api/userrole", routerRole);
};