const db = require("../../models");
const { compare } = require('../../function/key.function');
const Company = db.companys;
const Print = db.prints;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.template) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const print = ({
    module: req.body.module,
    template: req.body.template,
    company_id: req.body.company,
  });
  Print.create(print)
    .then(data => {
      res.send(data);
    }).catch(err => {console.error("print0101",err.message);res.status(500).send({message:err.message});})
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Print.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("print0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Print.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("print0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findByDet = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Print.findOne({where:{module:req.params.mod, company_id: req.params.comp}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("print0401",err.message);res.status(500).send({message:err.message}); });
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

  Print.update(req.body, {where: {id: req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    }).catch(err =>{console.error("print0501",err.message);res.status(500).send({message:err.message}); });
};