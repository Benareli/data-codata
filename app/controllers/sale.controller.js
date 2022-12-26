const db = require("../models");
const { compare } = require('../function/key.function');
const Sale = db.sales;
const Saledetail = db.saledetails;
const Product = db.products;
const Partner = db.partners;
const Log = db.logs;
const User = db.users;
const Warehouse = db.warehouses;
const mongoose = require("mongoose");

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.sale_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if(req.body.partner != "null"){
    const saleDat = ({
      sale_id: req.body.sale_id,
      date: req.body.date,
      expected: req.body.expected,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      customer: req.body.customer,
      warehouse: req.body.warehouse,
      user: req.body.user,
      paid: req.body.paid ? req.body.paid: 0,
      delivery_state: req.body.delivery_state ? req.body.delivery_state: 0,
      open: req.body.open ? req.body.open: true
    });
    Sale.create(saleDat).then(dataa => { 
      const log = ({message: "add", sale: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(dataa);
        }).catch(err =>{console.error("sale0101",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("sale0102",err.message);res.status(500).send({message:err.message}); });
  }
  else if(req.body.partner == "null"){
    const saleDat = ({
      sale_id: req.body.sale_id,
      date: req.body.date,
      expected: req.body.expected,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      warehouse: req.body.warehouse,
      user: req.body.user,
      paid: req.body.paid ? req.body.paid: 0,
      delivery_state: req.body.delivery_state ? req.body.delivery_state: 0,
      open: req.body.open ? req.body.open: true
    });
    Sale.create(saleDat).then(dataa => { 
      const log = ({message: "add", sale: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(dataa);
        }).catch(err =>{console.error("sale0103",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("sale0104",err.message);res.status(500).send({message:err.message}); });
  }
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const sale_id = req.query.sale_id;
  var condition = sale_id ? { sale_id: { $regex: new RegExp(sale_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Sale.find(condition)
    .populate({ path: 'customer', model: Partner })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sale0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Sale.findById(req.params.id)
    .populate({ path: 'customer', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("sale0301",err.message);res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  Sale.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: "update", sale: data._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("sale0401",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("sale0402",err.message);res.status(500).send({message:err.message}); });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Sale.findByIdAndRemove(req.params.id, { useFindAndModify: false })
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
    }).catch(err =>{console.error("sale0501",err.message);res.status(500).send({message:err.message}); });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Sale.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    }).catch(err =>{console.error("sale0601",err.message);res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.updateState = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Sale.findByIdAndUpdate(req.params.id, {$set: {open: req.params.state}}, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: "update state", sale: data._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("sale0401",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("sale0402",err.message);res.status(500).send({message:err.message}); });
};
