const db = require("../../models");
const { compare } = require('../../function/key.function');
const User = db.users;
const Role = db.roles;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.username) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const user = {
    username: req.body.description,
    password: req.body.password
  };
  User.create(user)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0101",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("user0301",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0401",err);res.status(500).send({message:err}); });
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
  User.update(req.body,{where:{id:id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    }).catch(err =>{console.error("user0501",err);res.status(500).send({message:err}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.findAll({ where: {active: true} })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0601",err);res.status(500).send({message:err}); });
};