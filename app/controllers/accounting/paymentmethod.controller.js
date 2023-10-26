const db = require("../../models");
const { compare } = require('../../function/key.function');
const {id,coa,journal} = require("../../function");
const Paymentmethod = db.paymentmethods;
const Coa = db.coas;
var entries = [];

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const payM = ({
    name: req.body.name,
    coa_id: req.body.coa,
    active: true,
  });
  Paymentmethod.create(payM).then(dataa => {
    res.send(dataa);
  }).catch(err =>{console.error("paym0101",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Paymentmethod.findAll({include: [
    {model: Coa, as: "coas"},
  ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("paym0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Paymentmethod.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("paym0301",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Paymentmethod.findOne({where:{name:req.params.name}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("paym0401",err);res.status(500).send({message:err}); });
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
  Paymentmethod.update({coa_id: req.body.coa, name: req.body.name}, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("paym0501",err);res.status(500).send({message:err}); });
};