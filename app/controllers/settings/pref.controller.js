const db = require("../../models");
const { compare } = require('../../function/key.function');
const Pref = db.prefs;
const mongoose = require("mongoose");

// Retrieve all from the database.
exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Pref.find()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pref0101",err.message);res.status(500).send({message:err.message}); });
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
  Pref.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {res.send(data);
       
      }
    }).catch(err =>{console.error("pref0201",err.message);res.status(500).send({message:err.message}); });
};