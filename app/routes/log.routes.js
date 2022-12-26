module.exports = app => {
  const logs = require("../controllers/log.controller.js");

  var routerLog = require("express").Router();

  // Create a new
  routerLog.post("/", logs.create);

  // Retrieve all
  routerLog.get("/", logs.findAll);

  // Retrieve a single
  routerLog.get("/:id", logs.findOne);

  // Update with id
  routerLog.put("/:id", logs.update);

  app.use("/api/logs", routerLog);
};