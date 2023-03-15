module.exports = app => {
  const saledetails = require("../../../controllers/transaction/sale/saledetail.controller.js");

  var routerSalDet = require("express").Router();

  // Create a new
  routerSalDet.post("/", saledetails.create);

  // Retrieve all
  routerSalDet.get("/", saledetails.findAll);

  // Retrieve a single
  routerSalDet.get("/:id", saledetails.findOne);

  // Retrieve by PO id
  routerSalDet.get("/so/:so", saledetails.findBySOId);

  // Retrieve by PO id
  routerSalDet.get("/poo/:product", saledetails.findByProduct);

  // Update with id
  routerSalDet.put("/:id", saledetails.update);

  // Delete with id
  routerSalDet.delete("/:id", saledetails.delete);
  
  // Update with id
  routerSalDet.put("/sendAll/:id/:partner/:wh/:date/:comp", saledetails.updateSendAll);

  app.use("/api/saledetails", routerSalDet);
};