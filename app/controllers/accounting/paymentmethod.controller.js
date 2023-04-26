const db = require("../../models");
const { compare } = require('../../function/key.function');
const {id,coa,journal} = require("../../function");
const { getCoa2 } = require("../../function/coa.function");
const Paymentmethod = db.paymentmethods;
const Coa = db.coas;
var journid, journalid, journalcount, payments, pays1, entries = [];

async function getJournalId1() {
  const res1 = await id.getJournalId1();
  return res1;
}

async function getCoaPayment(x, req) {
  const res2 = await coa.getCoaPayment(x, req);
  return res2;
}

async function getUpdateJournalId() {
  const res3 = await id.getUpdateJournalId();
  return res3;
}

async function getCoaPayout(x, req) {
  const res4 = await coa.getCoaPayout(x, req);
  return res4;
}

async function inputJournal(data) {
  const res5 = await journal.inputJournal(data);
  return res5;
}

exports.create = (req, res) => {
  pays1 = 0;
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const payM = ({
    name: req.body.name,
    coa_id: req.body.coa,
    active: true,
  });
  Paymentmethod.create(payM).then(dataa => {
    res.send(dataa);
  }).catch(err =>{console.error("paym0101",err.message);res.status(500).send({message:err.message}); });
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Paymentmethod.findAll({include: [
    {model: Coa, as: "coas"},
  ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("paym0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Paymentmethod.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("paym0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findByDesc = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Paymentmethod.findOne({where:{name:req.params.name}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("paym0401",err.message);res.status(500).send({message:err.message}); });
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
  Paymentmethod.update({coa_id: req.body.coa, name: req.body.name}, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("paym0501",err.message);res.status(500).send({message:err.message}); });
};