const db = require("../models");
const { compare } = require('../function/key.function');
const Id = db.ids;
const mongoose = require("mongoose");

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("id0101",err.message);res.status(500).send({message:err.message}); });
};

exports.findPOSessId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.findOne({where: {company: req.body.company}})
    .then(ids => {
      if(ids[0].pos_session < 10) prefixes = '00000';
      else if(ids[0].pos_session < 100) prefixes = '0000';
      else if(ids[0].pos_session < 1000) prefixes = '000';
      else if(ids[0].pos_session < 10000) prefixes = '00';
      else if(ids[0].pos_session < 100000) prefixes = '0';
      posid = ids[0].pre_pos_session+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].pos_session.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {pos_session: Number(ids[0].pos_session) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: posid});
          //console.log(data, posid);
        }).catch(err =>{console.error("id0201",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("id0202",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve POSID.
exports.findPOSId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.find()
    .then(ids => {
      if(ids[0].pos_id < 10) prefixes = '00000';
      else if(ids[0].pos_id < 100) prefixes = '0000';
      else if(ids[0].pos_id < 1000) prefixes = '000';
      else if(ids[0].pos_id < 10000) prefixes = '00';
      else if(ids[0].pos_id < 100000) prefixes = '0';
      posid = ids[0].pre_pos_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].pos_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {pos_id: Number(ids[0].pos_id) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: posid});
          //console.log(data, posid);
        }).catch(err =>{console.error("id0301",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("id0302",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve PaymentID.
exports.findPaymentId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.find()
    .then(ids => {
      if(ids[0].pay_id < 10) prefixes = '00000';
      else if(ids[0].pay_id < 100) prefixes = '0000';
      else if(ids[0].pay_id < 1000) prefixes = '000';
      else if(ids[0].pay_id < 10000) prefixes = '00';
      else if(ids[0].pay_id < 100000) prefixes = '0';
      payid = ids[0].pre_pay_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].pay_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {pay_id: Number(ids[0].pay_id) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: payid});
          //console.log(data, posid);
        }).catch(err =>{console.error("id0401",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("id0402",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve PaymentID.
exports.findTransferId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.find()
    .then(ids => {
      if(ids[0].transfer_id < 10) prefixes = '00000';
      else if(ids[0].transfer_id < 100) prefixes = '0000';
      else if(ids[0].transfer_id < 1000) prefixes = '000';
      else if(ids[0].transfer_id < 10000) prefixes = '00';
      else if(ids[0].transfer_id < 100000) prefixes = '0';
      transferid = ids[0].pre_transfer_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].transfer_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {transfer_id: Number(ids[0].transfer_id) + 1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: transferid});
          //console.log(data, posid);
        }).catch(err =>{console.error("id0501",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("id0502",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve PurchaseID.
exports.findPurchaseId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.find().then(ids => {
      if(ids[0].purchase_id < 10) prefixes = '00000';
      else if(ids[0].purchase_id < 100) prefixes = '0000';
      else if(ids[0].purchase_id < 1000) prefixes = '000';
      else if(ids[0].purchase_id < 10000) prefixes = '00';
      else if(ids[0].purchase_id < 100000) prefixes = '0';
      purchid = ids[0].pre_purchase_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].purchase_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {purchase_id: ids[0].purchase_id+1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: purchid});
        }).catch(err =>{console.error("id0601",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("id0602",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve PurchaseID.
exports.findSaleId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Id.find().then(ids => {
      if(ids[0].sale_id < 10) prefixes = '00000';
      else if(ids[0].sale_id < 100) prefixes = '0000';
      else if(ids[0].sale_id < 1000) prefixes = '000';
      else if(ids[0].sale_id < 10000) prefixes = '00';
      else if(ids[0].sale_id < 100000) prefixes = '0';
      saleid = ids[0].pre_sale_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].sale_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {sale_id: ids[0].sale_id+1}, {useFindAndModify: false})
        .then(data => {
          res.send({message: saleid});
        }).catch(err =>{console.error("id0701",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("id0702",err.message);res.status(500).send({message:err.message}); });
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

  Id.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {res.send({ message: "Updated successfully."});
       
      }
    })
    .catch(err => {console.error("id0801",err.message);
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });
};