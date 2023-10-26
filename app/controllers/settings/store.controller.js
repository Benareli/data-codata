const db = require("../../models");
const { compare } = require('../../function/key.function');
const Store = db.stores;
const Warehouse = db.warehouses;
const Log = db.logs;
const User = db.users;
const Coa = db.coas;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.store_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const store = ({store_name: req.body.store_name, store_addr: req.body.store_addr, 
    store_phone: req.body.store_addr, warehouse: req.body.warehouse,
    active: req.body.active ? req.body.active : true, company: req.body.company});
  Store.create(store).then(dataa => {
    const log = ({message: "add", store: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{console.error("sto0101",err);res.status(500).send({message:err}); });
  }).catch(err =>{console.error("sto0102",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Store.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sto0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Store.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("sto0301",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  const store_name = req.query.store_name;
  var condition = store_name ? { store_name: { $regex: new RegExp(store_name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Store.findAll({where: condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sto0401",err);res.status(500).send({message:err}); });
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
  Store.update(req.body, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, store: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("sto0501",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("sto0502",err);res.status(500).send({message:err}); });
};

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Store.delete(req.params.id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({message: "Deleted successfully!"});
      }
    }).catch(err =>{console.error("sto0601",err);res.status(500).send({message:err}); });
};

exports.deleteAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Store.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Data were deleted successfully!`
      });
    }).catch(err =>{console.error("sto0701",err);res.status(500).send({message:err}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Store.findAll({where: { active: true, company_id: req.params.comp },
    include: [
      {model: Coa, as: "receivables"},
      {model: Coa, as: "payables"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sto0801",err);res.status(500).send({message:err}); });
};