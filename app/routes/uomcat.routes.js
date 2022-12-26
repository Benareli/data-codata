module.exports = app => {
  const uomcats = require("../controllers/uomcat.controller.js");

  var routerUomcat = require("express").Router();

  // Create a new
  routerUomcat.post("/", uomcats.create);

  // Retrieve all
  routerUomcat.get("/", uomcats.findAll);

  // Retrieve a single
  routerUomcat.get("/:id", uomcats.findOne);

  // Update with id
  routerUomcat.put("/:id", uomcats.update);

  app.use("/api/uomcats", routerUomcat);
};