const db = require("../models");
const {id,coa,cache,journal,qop} = require("../function");
const { compare } = require('../function/key.function');
const Purchase = db.purchases;
const Purchasedetail = db.purchasedetails;
const Qop = db.qops;
const Id = db.ids;
const Uom = db.uoms;
const Product = db.products;
const Qof = db.qofs;
const Stockmove = db.stockmoves;
const Coa = db.coas;
const Entry = db.entrys;
const Journal = db.journals;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var transid;
var transferid;
var trasnfercount;
var journid;
var journalid;
var journalcount;
var y1;
var x;
var qin;

async function getTransId() {
  const res1 = await id.getTransId();
  return res1;
}

async function getUpdateJournalId() {
  const res2 = await id.getUpdateJournalId();
  return res2;
}

async function getCoa2(coa1, coa2) {
  const res3 = await coa.getCoa2(coa1, coa2);
  return res3;
}

async function updateProductCache() {
  const res4 = await cache.updateProductCache();
  return res4;
}

async function inputJournal(xx, yy, debit, credit, amount, label1, label2, type, date) {
  const jour1 = await journal.inputJournal(xx, yy, debit, credit, amount, label1, label2, type, date);
  return jour1;
}

async function insertUpdateQop(productid, partnerid, whid, data) {
  const qop1 = await qop.insertUpdateQop(productid, partnerid, whid, data);
  return qop1;
}

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.purchase_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const purchasedet = ({
    purchase_id: req.body.purchase_id,
    qty: req.body.qty,
    qty_done: req.body.qty_done,
    qty_inv: req.body.qty_inv,
    uom: req.body.uom,
    price_unit: req.body.price_unit,
    discount: req.body.discount,
    tax: req.body.tax,
    subtotal: req.body.subtotal,
    product: req.body.product,
    warehouse: req.body.warehouse,
    date: req.body.date
  });
  Purchasedetail.create(purchasedet).then(dataa => { 
    Purchase.findOneAndUpdate({purchase_id:req.body.purchase_id}, {$push: {purchase_detail: dataa._id}}, { useFindAndModify: false })
      .then(datab => {
          res.send(datab);
      }).catch(err =>{console.error("purd0101",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("purd0102",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("purd0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.findById(req.params.id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("purd0301",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByPOId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.find({purchase_id: req.params.po})
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("purd0401",err.message);res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  Purchasedetail.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("purd0501",err.message);res.status(500).send({message:err.message}); });
};

// Update Receive
exports.updateReceiveAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  x = 0;
  //console.log(req.body);
  startProcess(req, res);
};

function startProcess(req, res){
  if(req.body[x] && req.body[x].qty_rec > 0){
  qin = req.body[x].qty_rec;
  Purchasedetail.findById(req.body[x].id)
    .then(dataa => {
      getTransId().then(tids => {
        transid = tids[0];
        transferid = tids[1];
        transfercount = tids[2];
        const stockmove = ({
          trans_id: transid,
          user: req.params.id,
          product: req.body[x].product._id,
          warehouse: req.params.wh,
          origin: dataa.purchase_id,
          qin: qin,
          uom: req.body[x].uom._id,
          date: req.params.date,
        });
        Stockmove.create(stockmove).then(datad => {
          Purchasedetail.findOneAndUpdate({_id: req.body[x].id}, {qty_done: req.body[x].qty_done + qin}, {useFindAndModify: false})
            .then(dataf => {
              Purchasedetail.findOneAndUpdate({_id: req.body[x].id}, {$push: {stockmove: datad._id}}, {useFindAndModify: false})
                .then(datag => {
                  insertUpdateQop(req.body[x].product._id, req.params.partner, req.params.wh, req.body[x]).then(qop => {
                    updateProductCache().then(upc => {
                      insertAcc(req, res);
                  }).catch(err =>{console.error("purd0601",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("purd0602",err.message);res.status(500).send({message:err.message}); });
              }).catch(err =>{console.error("purd0603",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("purd0604",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("purd0605",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("purd0606",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("purd0607",err.message);res.status(500).send({message:err.message}); });
  }else {
    if(req.body[x]) sequencing(req, res);
    else {
      Id.findOneAndUpdate({_id: transferid}, {transfer_id: transfercount+1}, {useFindAndModify: false})
        .then(datae => {
          res.send({message: "DONE!"});
        }).catch(err =>{console.error("purd0690",err.message);res.status(500).send({message:err.message}); });
    }
  }
}

function insertAcc(req, res) {
  inputJournal("2-3001", "1-3001", (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin), 
    (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin), (Number(req.body[x].subtotal) / Number(req.body[x].qty) * qin),
    req.body[x].product.name, req.body[x].product.name, "transfer", req.params.date).then(inputJour => {
      sequencing(req, res);
    }).catch(err =>{console.error("purd0801",err.message);res.status(500).send({message:err.message}); });
}

function sequencing(req, res){
  x=x+1;
  startProcess(req, res);
}

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.findById(req.params.id)
    .then(data => {
      Purchase.findOneAndUpdate({purchase_id: data.purchase_id}, {$pull: {purchase_detail: data._id}}, { useFindAndModify: false })
        .then(dataa => {
          Purchasedetail.findByIdAndRemove(req.params.id, { useFindAndModify: false })
            .then(datab => {
              res.send(datab);
            }).catch(err =>{console.error("purd0901",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("purd0902",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("purd0903",err.message);res.status(500).send({message:err.message}); });
};

// Delete all from the database.
exports.deleteAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.deleteMany({})
    .then(data => {
      res.send({message: `${data.deletedCount} Data were deleted successfully!`});
    }).catch(err =>{console.error("purd1001",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  
  Purchasedetail.aggregate([
    { $match: {
      product: ObjectId(req.params.product)
    }},
    {
      $group:
      {
        _id: { product: "$product" },
        totalLine: { $sum: 1 },
        totalQty: { $sum: "$qty_done" }
      }
    }
    ])
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("purd1101",err.message);res.status(500).send({message:err.message}); });
};