const db = require("../../models");
const { compare } = require('../../function/key.function');
const Journal = db.journals;
const Entry = db.entrys;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0101",err);res.status(500).send({message:err}); });  
};

exports.findActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.findAll({where:{active: true}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0102",err);res.status(500).send({message:err}); });  
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("coa0103",err);res.status(500).send({message:err}); });
};

exports.findByPrefix = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.findAll({where:{prefix: req.params.prefix, active: true}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0104",err);res.status(500).send({message:err}); });
};

exports.findByType = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Coa.findAll({where:{type: req.params.type, active: true}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("coa0104",err);res.status(500).send({message:err}); });
};