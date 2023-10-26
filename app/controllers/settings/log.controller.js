const db = require("../../models");
const { compare } = require('../../function/key.function');
const Log = db.logs;
const Store = db.stores;
const ProductCat = db.productcats;
const Brand = db.brands;
const Product = db.products;
const Uomcat = db.uomcats;
const Uom = db.uoms;
const Partner = db.partners;
const Warehouse = db.warehouses;
const User = db.users;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.message) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.brand != "null"){
    const log = ({
      message: req.body.message,
      brand: req.body.brand,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0101",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.category != "null"){
    const log = ({
      message: req.body.message,
      category: req.body.category,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0102",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.product != "null"){
    const log = ({
      message: req.body.message,
      product: req.body.product,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0103",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.uom_cat != "null"){
    const log = ({
      message: req.body.message,
      uom_cat: req.body.uom_cat,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0104",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.uom != "null"){
    const log = ({
      message: req.body.message,
      uom: req.body.uom,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0105",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.partner != "null"){
    const log = ({
      message: req.body.message,
      partner: req.body.partner,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0106",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.warehouse != "null"){
    const log = ({
      message: req.body.message,
      warehouse: req.body.warehouse,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0107",err);res.status(500).send({message:err});
    });
  }
  else if(req.body.store != "null"){
    const log = Log.create({
      message: req.body.message,
      store: req.body.store,
      user: req.body.user,
    });
    Log.create(log).then(data => {res.send(data);
      }).catch(err => {console.error("log0108",err);res.status(500).send({message:err});
    });
  }
};



// Retrieve all from the database.
exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Log.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("log0201",err);res.status(500).send({message:err}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Log.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("log0301",err);res.status(500).send({message:err}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const message = req.query.message;
  var condition = message ? { message: { $regex: new RegExp(message), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Log.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("log0401",err);res.status(500).send({message:err}); });
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

  Log.update(req.body, {where: {id: req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    }).catch(err =>{console.error("log0501",err);res.status(500).send({message:err}); });
};