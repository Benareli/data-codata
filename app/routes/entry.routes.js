module.exports = app => {
  const entrys = require("../controllers/entry.controller.js");

  var routerEnt = require("express").Router();

  // Retrieve all
  routerEnt.get("/", entrys.findAll);

  // Retrieve a single
  routerEnt.get("/id/:id", entrys.findOne);

  // Retrieve a single
  routerEnt.get("/journal/:journal", entrys.findByJournal);

  app.use("/api/entrys", routerEnt);
};