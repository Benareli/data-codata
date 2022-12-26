module.exports = app => {
  const stockmoves = require("../controllers/stockmove.controller.js");

  var routerSM = require("express").Router();

  // Create a new
  routerSM.post("/", stockmoves.create);

  // Retrieve all
  routerSM.get("/", stockmoves.findAll);

  // Retrieve all
  routerSM.get("/transin/:product", stockmoves.findTransIn);

  // Retrieve all
  routerSM.get("/transout/:product", stockmoves.findTransOut);

  // Retrieve a single
  routerSM.get("/id/:id", stockmoves.findOne);

  // Retrieve a single
  routerSM.get("/transid/:transid", stockmoves.findTransId);

  // Retrieve a single
  routerSM.get("/origin/:origin", stockmoves.findOrigin);

  // Retrieve a single
  routerSM.get("/prod/:product", stockmoves.findByDesc);

  // Retrieve a single
  routerSM.get("/wh/:wh", stockmoves.findByWh);

  app.use("/api/stockmoves", routerSM);
};