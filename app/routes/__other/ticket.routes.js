module.exports = app => {
  const tickets = require("../controllers/ticket.controller.js");

  var routerTick = require("express").Router();

  // Create a new
  routerTick.post("/", tickets.create);

  // Retrieve all
  routerTick.get("/", tickets.findAll);

  // Retrieve a single
  routerTick.get("/:id", tickets.findOne);

  // Update with id
  routerTick.put("/:id", tickets.update);
  
  // Delete with id
  routerTick.delete("/:id", tickets.delete);

  app.use("/api/tickets", routerTick);
};