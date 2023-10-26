const db = require("../models");
const { compare } = require('../function/key.function');
const Project = db.projects;
const Partner = db.partners;
const Journal = db.journals;

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.bundle) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const bundle = ({
    bundle: req.body.bundle,
    qty: req.body.qty,
    uom: req.body.uom,
    product: req.body.product
  });
  Bundle.create(bundle).then(dataa => {
      res.send(dataa);
  }).catch(err =>{console.error("bun0101",err);res.status(500).send({message:err}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const bundle = req.query.bundle;
  var condition = bundle ? { bundle: { $regex: new RegExp(bundle), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.find(condition)
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bun0201",err);res.status(500).send({message:err}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.findById(req.params.id)
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("bun0301",err);res.status(500).send({message:err}); });
};

// Find a single with an desc
exports.findByJournal = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.find({bundle: req.params.bundle})
    .populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bun0501",err);res.status(500).send({message:err}); });
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

  Bundle.findByIdAndUpdate(req.params.id, ({
    bundle: req.body.bundle,
    qty: req.body.qty,
    uom: req.body.uom,
    product: req.body.product
  }), { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else{
        const log = ({message: req.body.message, brand: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("bun0601",err);res.status(500).send({message:err}); });
      } 
    }).catch(err =>{console.error("bun0602",err);res.status(500).send({message:err}); });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.findByIdAndRemove(req.params.id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({
          message: "Deleted successfully!"
        });
      }
    }).catch(err =>{console.error("bun0701",err);res.status(500).send({message:err}); });
};