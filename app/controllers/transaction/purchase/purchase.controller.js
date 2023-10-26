const db = require("../../../models");
const { compare } = require('../../../function/key.function');
const Purchase = db.purchases;
const Purchasedetail = db.purchasedetails;
const Product = db.products;
const Partner = db.partners;
const Log = db.logs;
const User = db.users;
const Warehouse = db.warehouses;
const Company = db.companys;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.purchase_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const purchaseDat = ({
    purchase_id: req.body.purchase_id,
    date: req.body.date,
    expected: req.body.expected,
    disc_type: req.body.disc_type,
    discount: req.body.discount,
    amount_untaxed: req.body.amount_untaxed,
    amount_tax: req.body.amount_tax,
    amount_total: req.body.amount_total,
    partner_id: req.body.supplier,
    warehouse_id: req.body.warehouse,
    user_id: req.body.user,
    paid: req.body.paid ? req.body.paid: 0,
    delivery_state: req.body.delivery_state ? req.body.delivery_state: 0,
    open: req.body.open ? req.body.open: true,
    company_id: req.body.company
  });
  Purchase.create(purchaseDat).then(dataa => { 
    const log = ({message: "add", purchase: dataa.id, user: req.body.user,});
      Log.create(log).then(datab => {
        res.send(dataa);
      }).catch(err =>{console.error("pur0101",err);res.status(500).send({message:err}); });
    }).catch(err =>{console.error("pur0102",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchase.findAll({ include: [
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: User, as: "users"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pur0201",err);res.status(500).send({message:err}); });
};

exports.findAllByComp = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchase.findAll({where:{company_id:req.params.comp}, include: [
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: User, as: "users"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pur0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchase.findByPk(req.params.id, { include: [
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: User, as: "users"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("pur0301",err);res.status(500).send({message:err}); });
};

exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  Purchase.update(req.body, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({message: `Cannot update with id=${id}. Maybe Data was not found!`});
      } else {
        const log = ({message: "update", purchase: data.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("pur0401",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("pur0402",err);res.status(500).send({message:err}); });
};

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchase.destroy({where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({message: `Cannot delete with id=${id}. Maybe Data was not found!`});
      } else {
        res.send({message: "Deleted successfully!"});
      }
    }).catch(err =>{console.error("pur0501",err);res.status(500).send({message:err}); });
};

exports.deleteAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchase.destroy({})
    .then(data => {
      res.send({message: `${data.deletedCount} Data were deleted successfully!`});
    }).catch(err =>{console.error("pur0601",err);res.status(500).send({message:err}); });
};

exports.updateState = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchase.update({open: req.params.state}, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({message: `Cannot update with id=${id}. Maybe Data was not found!`});
      } else {
        const log = ({message: "update state", purchase: data._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("pur0701",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("pur0702",err);res.status(500).send({message:err}); });
};
