module.exports = app => {
  const prefs = require("../../controllers/settings/pref.controller.js");

  var prefSetting = require("express").Router();

  // Retrieve all
  prefSetting.get("/", prefs.findAll);

  // Update with id
  prefSetting.put("/:id", prefs.update);

  app.use("/api/prefs", prefSetting);
};