module.exports = app => {
  const settings = require("../controllers/setting.controller.js");

  var routerSetting = require("express").Router();

  // Retrieve all
  routerSetting.get("/", settings.findAll);

  // Update with id
  routerSetting.put("/:id", settings.update);

  app.use("/api/settings", routerSetting);
};