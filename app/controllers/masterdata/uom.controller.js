const db = require("../../models");
const { compare } = require('../../function/key.function');
const Uom = db.uoms;
const Uomcat = db.uomcats;
const Log = db.logs;
const User = db.users;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.uom_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const uoms = ({uom_name: req.body.uom_name, uomcatId: req.body.uom_cat,
    ratio: req.body.ratio, reference: req.body.reference});
  Uom.create(uoms).then(dataa => {
    const log = ({message: "add", uom: dataa.id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{console.error("uom0101",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("uom0102",err.message);res.status(500).send({message:err.message}); });
};

exports.findAll = (req, res) => {
  const uom = req.query.uom;
  var condition = uom ? { uom: { $regex: new RegExp(uom), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uom.findAll({ include: [{ model: Uomcat, as: "uomcats" }] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("uom0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uom.findByPk(req.params.id, { include: [{ model: Uomcat, as: "uomcats" }] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("uom0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findByCat = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Uom.findAll({where: {uomcatId: req.params.uomcat}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("uom0401",err.message);res.status(500).send({message:err.message}); });
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
  Uom.update(req.body, { where: {id: req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, uom: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("uom0501",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("uom0502",err.message);res.status(500).send({message:err.message}); });
};