const db = require("../models");
const { compare } = require('../function/key.function');
const Costing = db.costings;
const Product = db.products;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.product) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const costing = ({product_id: req.body.product_id, overhead: req.body.overhead, ovType: req.body.ovType, ovTime: req.body.ovTime, 
    labor: req.body.labor, laType: req.body.laType, laTime: req.body.laTime});
  Costing.create(costing).then(dataa => {
      res.send(dataa);
    }).catch(err =>{console.error("cost0101",err.message);res.status(500).send({message:err.message}); });
};

exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Costing.findAll({ include: [
      {model: Product, as: "products"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("cost0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Costing.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("cost0301",err.message);res.status(500).send({message:err.message}); });
};

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
  Costing.update(req.body, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("cost0401",err.message);res.status(500).send({message:err.message}); });
};

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Costing.destroy({where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({message: "Done"});
      }
    }).catch(err =>{console.error("cost501",err.message);res.status(500).send({message:err.message}); });
};

exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Costing.findAll({where:{product_id: req.params.product_id},
    include: [
      {model: Product, as: "products"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("cost0601",err.message);res.status(500).send({message:err.message}); });
};