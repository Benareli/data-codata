module.exports = app => {
  const stockrequests = require("../../../controllers/transaction/stock/stockrequest.controller.js");

  var routerSR = require("express").Router();

  // Create a new
  routerSR.post("/", stockrequests.create);

  // Retrieve all
  routerSR.get("/", stockrequests.findAll);

  // Retrieve all
  routerSR.get("/transin/:product", stockrequests.findTransIn);

  // Retrieve all
  routerSR.get("/transout/:product", stockrequests.findTransOut);

  // Retrieve a single
  routerSR.get("/id/:id", stockrequests.findOne);

  // Retrieve a single
  routerSR.get("/transid/:transid", stockrequests.findTransId);

  // Retrieve a single
  routerSR.get("/origin/:origin", stockrequests.findOrigin);

  // Retrieve a single
  routerSR.get("/prod/:product", stockrequests.findByDesc);

  // Retrieve a single
  routerSR.get("/valtransid/:transid", stockrequests.validateByTransid);

  app.use("/api/stockrequests", routerSR);
};