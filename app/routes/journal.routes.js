module.exports = app => {
  const journals = require("../controllers/journal.controller.js");

  var routerJour = require("express").Router();

  // Retrieve all
  routerJour.get("/", journals.findAll);

  // Retrieve a single
  routerJour.get("/id/:id", journals.findOne);

  // Retrieve all journal
  routerJour.get("/journal", journals.findJournal);

  // Retrieve one journal
  routerJour.get("/journ/:journal", journals.findJourn);

  // Retrieve one journal
  routerJour.get("/origin/:origin", journals.findOrigin);

  // Retrieve all bill
  routerJour.get("/bill", journals.findBill);

  // Create a new
  routerJour.post("/bill", journals.createBill);

  // Retrieve all inv
  routerJour.get("/inv", journals.findInv);

  // Create a new
  routerJour.post("/inv", journals.createInv);

  // Update with id
  routerJour.put("/lock/:id", journals.updateLock);

  app.use("/api/journals", routerJour);
};