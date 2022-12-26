const db = require("../models");
const { compare } = require('../function/key.function');
const Uom = db.uoms;
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
  if (!req.body.uom_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const uoms = ({uom_name: req.body.uom_name, uom_cat: req.body.uom_cat,
    ratio: req.body.ratio, reference: req.body.reference});
  Uom.create(uoms).then(dataa => {
    const log = ({message: "add", uom: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{console.error("uom0101",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("uom0102",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const uom = req.query.uom;
  var condition = uom ? { uom: { $regex: new RegExp(uom), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uom.find(condition)
    .populate({ path: 'uom_cat', model: Uomcat })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("uom0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uom.findById(req.params.id)
    .populate({ path: 'uom_cat', model: Uomcat })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("uom0301",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByCat = (req, res) => {
  //const uom = req.query.uom;
  //var condition = uom ? { uom: { $regex: new RegExp(uom), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uom.find({uom_cat: req.params.uomcat})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("uom0401",err.message);res.status(500).send({message:err.message}); });
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
  Uom.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .populate({ path: 'uom_cat', model: Uomcat })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, uom: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("uom0501",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("uom0502",err.message);res.status(500).send({message:err.message}); });
};