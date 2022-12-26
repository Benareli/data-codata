module.exports = app => {
  const stores = require("../controllers/store.controller.js");

  var routerStore = require("express").Router();

  // Create a new
  routerStore.post("/", stores.create);

  // Retrieve all
  routerStore.get("/", stores.findAll);

  // Retrieve all active
  routerStore.get("/active", stores.findAllActive);

  // Retrieve a single
  routerStore.get("/:id", stores.findOne);

  // Update with id
  routerStore.put("/:id", stores.update);

  // Delete with id
  routerStore.delete("/:id", stores.delete);

  // Create new
  routerStore.delete("/", stores.deleteAll);

  app.use("/api/stores", routerStore);
};