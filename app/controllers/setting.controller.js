const db = require("../models");
const { compare } = require('../function/key.function');
const Setting = db.settings;
const mongoose = require("mongoose");

// Retrieve all from the database.
exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Setting.find()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sett0101",err.message);res.status(500).send({message:err.message}); });
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
  Setting.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {res.send(data);
       
      }
    }).catch(err =>{console.error("sett0201",err.message);res.status(500).send({message:err.message}); });
};