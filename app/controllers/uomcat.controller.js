const db = require("../models");
const { compare } = require('../function/key.function');
const Uomcat = db.uomcats;
const Log = db.logs;
const User = db.users;

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const uomcats = ({uom_cat: req.body.uom_cat});
  Uomcat.create(uomcats).then(dataa => {
    const log = ({message: "add", uomcat: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{console.error("uomcat0101",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("uomcat0102",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const uom_cat = req.query.uom_cat;
  var condition = uom_cat ? { uom_cat: { $regex: new RegExp(uom_cat), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uomcat.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("uomcat0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uomcat.findById(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("uomcat0301",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const uom_cat = req.query.uom_cat;
  var condition = uom_cat ? { uom_cat: { $regex: new RegExp(uom_cat), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uomcat.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("uomcat0401",err.message);res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  Uomcat.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, uom_cat: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("uomcat0501",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("uomcat0502",err.message);res.status(500).send({message:err.message}); });
};