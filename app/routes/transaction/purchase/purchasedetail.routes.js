module.exports = app => {
  const purchasedetails = require("../../../controllers/transaction/purchase/purchasedetail.controller.js");

  var routerPurDet = require("express").Router();

  // Create a new
  routerPurDet.post("/", purchasedetails.create);

  // Retrieve all
  routerPurDet.get("/", purchasedetails.findAll);

  // Retrieve a single
  routerPurDet.get("/:id", purchasedetails.findOne);

  // Retrieve by PO id
  routerPurDet.get("/po/:po", purchasedetails.findByPOId);

  // Retrieve by PO id
  routerPurDet.get("/poo/:product", purchasedetails.findByProduct);

  // Update with id
  routerPurDet.put("/:id", purchasedetails.update);

  // Delete with id
  routerPurDet.delete("/:id", purchasedetails.delete);
  
  // Update with id
  routerPurDet.put("/receiveAll/:id/:partner/:wh/:date", purchasedetails.updateReceiveAll);

  app.use("/api/purchasedetails", routerPurDet);
};