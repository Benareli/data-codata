const db = require("../models");
const { compare } = require('../function/key.function');
const Journal = db.journals;
const Entry = db.entrys;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;

// Retrieve all from the database.
exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.find()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0101",err.message);res.status(500).send({message:err.message}); });  
};

// Retrieve all from the database.
exports.findActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.find({active: true})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0102",err.message);res.status(500).send({message:err.message}); });  
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.findById(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("coa0103",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByPrefix = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.find({prefix: req.params.prefix})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0104",err.message);res.status(500).send({message:err.message}); });
};