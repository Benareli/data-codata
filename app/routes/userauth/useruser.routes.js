module.exports = app => {
  const users = require("../../controllers/userauth/useruser.controller.js");

  var routerUserUser = require("express").Router();

  // Create a new
  routerUserUser.post("/", users.create);

  // Retrieve all
  routerUserUser.get("/", users.findAll);

  // Retrieve all active
  routerUserUser.get("/active", users.findAllActive);

  // Retrieve a single
  routerUserUser.get("/:id", users.findOne);

  // Update with id
  routerUserUser.put("/:id", users.update);

  app.use("/api/useruser", routerUserUser);
};