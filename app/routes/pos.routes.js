module.exports = app => {
  const poss = require("../controllers/pos.controller.js");

  var routerPos = require("express").Router();

  // Create a new
  routerPos.post("/", poss.create);

  // Retrieve all
  routerPos.get("/", poss.findAll);

  // Retrieve a single
  routerPos.get("/:id", poss.findOne);

  // Update with id
  routerPos.put("/:id", poss.update);

  app.use("/api/poss", routerPos);
};