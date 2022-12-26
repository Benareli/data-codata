const db = require("../models");
const { compare } = require('../function/key.function');
const Bom = db.boms;
const Product = db.products;
const Uom = db.uoms;

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.product) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const bom = ({product: req.body.product, bom: req.body.bom, 
    uom: req.body.uom, qty: req.body.qty});
  Bom.create(bom).then(dataa => {
      res.send(dataa);
    }).catch(err =>{console.error("bom0101",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'bom', model: Product })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bom0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.findById(req.params.id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'bom', model: Product })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("bom0301",err.message);res.status(500).send({message:err.message}); });
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
  Bom.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("bom0401",err.message);res.status(500).send({message:err.message}); });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.findByIdAndRemove(req.params.id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({message: "Done"});
      }
    }).catch(err =>{console.error("bom0501",err.message);res.status(500).send({message:err.message}); });
};

// Find by product
exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.find({ product: req.params.product })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'bom', model: Product })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bom0601",err.message);res.status(500).send({message:err.message}); });
};

// Find aggregate Product
exports.findByProductAggr = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  
  Bom.aggregate([
    { $lookup: {
      from: "products",
      localField: "product",
      foreignField: "_id",
      as: "product"
    }},
    {
      $group:
      {
        _id: { product: "$product" },
        totalLine: { $sum: 1 }
      }
    }  
    ])
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("bom0701",err.message);res.status(500).send({message:err.message}); });

  /*Bom.find({ product: req.params.product })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'bom', model: Product })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bom0601",err.message);res.status(500).send({message:err.message}); });*/

};