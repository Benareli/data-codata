module.exports = app => {
  const qofs = require("../controllers/qof.controller.js");

  var routerQof = require("express").Router();

  // Create a new
  routerQof.post("/", qofs.create);

  // Retrieve all
  routerQof.get("/", qofs.findAll);

  // Retrieve a single
  routerQof.get("/:id", qofs.findOne);

  app.use("/api/qofs", routerQof);
};