const db = require("../../models");
const { compare } = require('../../function/key.function');
const Tax = db.taxs;
const Log = db.logs;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const tax = ({
    tax: req.body.tax,
    name: req.body.name,
    include: req.body.include ? req.body.include: false,
    company: req.body.company
  });
  Tax.create(tax).then(dataa => {
    res.send(dataa);
  }).catch(err =>{console.error("tax0101",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Tax.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("tax0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Tax.findByPk(id)
    .then(data => {
      if (!data) res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("tax0301",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Tax.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("tax0401",err);res.status(500).send({message:err}); });
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
  Tax.update(req.body, {where: {id: req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, tax: data.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("tax0501",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("tax0502",err);res.status(500).send({message:err}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Tax.find({where: { active: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("tax0601",err);res.status(500).send({message:err}); });
};