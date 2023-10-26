const db = require("../../models");
const { compare } = require('../../function/key.function');
const Bundle = db.bundles;
const Product = db.products;
const Uom = db.uoms;
const duplicate = [];

exports.create = (req, res) => {
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
    uom_id: req.body.uom_id,
    product_id: req.body.product_id
  });
  Bundle.create(bundle).then(dataa => {
      res.send(dataa);
  }).catch(err =>{console.error("bun0101",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.findAll({ include: [
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bun0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.findByPk(req.params.id, {include: [
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
    ] })
    /*.populate({ path: 'bundle', model: Product })
    .populate({ path: 'uom', model: Uom })
    .populate({ path: 'product', model: Product })*/
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("bun0301",err);res.status(500).send({message:err}); });
};

exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.findAll({where:{product_id: req.params.product},
    include: [
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bun0401",err);res.status(500).send({message:err}); });
};

exports.findByBundle = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.findAll({where:{bundle: req.params.bundle}, 
    include: [
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bun0501",err);res.status(500).send({message:err}); });
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

  Bundle.update(({
    bundle: req.body.bundle,
    qty: req.body.qty,
    uom_id: req.body.uom,
    product_id: req.body.product
  }), {where:{id:req.params.id}})
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

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bundle.destroy({where:{id:req.params.id}, truncate: false})
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