module.exports = app => {
  const projects = require("../controllers/project.controller.js");

  var routerProj = require("express").Router();

  // Create a new
  routerProj.post("/", projects.create);

  // Retrieve all
  routerProj.get("/", projects.findAll);

  // Retrieve by bundle
  routerProj.get("/journal/:journal", projects.findByJournal);

  // Retrieve a single
  routerProj.get("/:id", projects.findOne);

  // Update with id
  routerProj.put("/:id", projects.update);
  
  // Delete with id
  routerProj.delete("/:id", projects.delete);

  app.use("/api/projects", routerProj);
};