module.exports = app => {
  const files = require("../controllers/file.controller.js");

  var routerFile = require("express").Router();

  // Create a new
  routerFile.post("/upload", files.upload);

  // Retrieve all
  routerFile.get("/files", files.getListFiles);

  // Retrieve all active
  routerFile.get("/files/:name", files.download);

  app.use("/api/files", routerFile);
};
