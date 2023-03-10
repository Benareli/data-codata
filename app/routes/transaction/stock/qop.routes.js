module.exports = app => {
  const qops = require("../../../controllers/transaction/stock/qop.controller.js");

  var routerQop = require("express").Router();

  // Create a new
  routerQop.post("/", qops.create);

  // Retrieve all
  routerQop.get("/", qops.findAll);

  // Retrieve a single
  routerQop.get("/id/:id", qops.findOne);
  
  // Retrieve a single
  routerQop.get("/prod/:product/:warehouse", qops.findByProduct);

  // Retrieve a single
  routerQop.get("/product/:product", qops.findByProduct3);

  // Retrieve a single
  routerQop.get("/prodqop/:product/", qops.findByProd);

  // Retrieve a single
  routerQop.get("/whqop/:warehouse/", qops.findByWh);

  // Retrieve a single
  routerQop.get("/findprod", qops.findByProduct2);
  
  // Update with id
  routerQop.post("/cu", qops.createUpdate);

  app.use("/api/qops", routerQop);
};