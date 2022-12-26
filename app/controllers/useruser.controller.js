const db = require("../models");
const { compare } = require('../function/key.function');
const User = db.users;
const Role = db.roles;

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.username) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create
  const user = new User({
    username: req.body.description,
    password: req.body.password
  });

  // Save in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0101",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.find(condition)
    .populate({ path: 'roles', model: Role })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.findById(req.params.id)
    .populate({ path: 'roles', model: Role })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("user0301",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0401",err.message);res.status(500).send({message:err.message}); });
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
  User.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    }).catch(err =>{console.error("user0501",err.message);res.status(500).send({message:err.message}); });
};

// Find all active
exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  User.find({ active: true })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("user0601",err.message);res.status(500).send({message:err.message}); });
};