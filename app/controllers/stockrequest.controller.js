const db = require("../models");
const {id,coa,cache,journal,qop} = require("../function");
const { compare } = require('../function/key.function');
const Stockrequest = db.stockrequests;
const Stockmove = db.stockmoves;
const Qop = db.qops;
const Journal = db.journals;
const Entry = db.entrys;
const Product = db.products;
const Partner = db.partners;
const Uom = db.uoms;
const Warehouse = db.warehouses;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
const mongoose =  require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var transid;
//const mongoose = require("mongoose");

async function getUpdateTransId() {
  const res1 = await id.getUpdateTransId();
  return res1;
}

async function updateProductCache() {
  const res2 = await cache.updateProductCache();
  return res2;
}

async function inputJournalStock(xx, yy, qt, req, prodname) {
  const jour1 = await journal.inputJournalStock(xx, yy, qt, req, prodname);
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
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{
    getTransId(req, res);
  }
};

function getTransId(req, res) {
  getUpdateTransId().then(restransid => {
      transid = restransid;
      startSequence(0, req, res);
    }).catch(err =>{console.error("str0101",err.message);res.status(500).send({message:err.message}); });
}

function startSequence(x, req, res){
  if(req.body[x]){
    if(req.body[x].type == "In"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product: req.body[x].prodid,
        warehouse: req.body[x].from,
        qin: req.body[x].qty,
        uom: req.body[x].uomid,
        date: req.body[x].date,
        req: true,
      });
      Stockrequest.create(stockmove).then(data => {
          sequencing(x, req, res);
        }).catch(err => {console.error("str0201",err.message);res.status(500).send({message:err.message});
      });
    }
    else if(req.body[x].type == "Out"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product: req.body[x].prodid,
        warehouse: req.body[x].from,
        qout: req.body[x].qty,
        uom: req.body[x].uomid,
        date: req.body[x].date,
        req: true,
      });
      Stockrequest.create(stockmove).then(data => {
          sequencing(x, req, res);
        }).catch(err => {console.error("str0301",err.message);res.status(500).send({message:err.message}); });
    }
    else if(req.body[x].type == "Internal"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product: req.body[x].prodid,
        warehouse: req.body[x].from,
        qout: req.body[x].qty,
        uom: req.body[x].uomid,
        date: req.body[x].date,
        req: true,
      });
      Stockrequest.create(stockmove).then(data => {
        const stockmove = ({
          trans_id: transid,
          user: req.body[x].user,
          product: req.body[x].prodid,
          warehouse: req.body[x].to,
          qin: req.body[x].qty,
          uom: req.body[x].uomid,
          date: req.body[x].date,
          req: true,
        });
        Stockrequest.create(stockmove).then(data => {
          sequencing(x, req, res);
        }).catch(err => {console.error("str0302",err.message);res.status(500).send({message:err.message}); })
      }).catch(err => {console.error("str0303",err.message);res.status(500).send({message:err.message}); })
    }
  }else{
    res.send({message: "Stock Request done"})
  }
}

function sequencing(x, req, res){
  x=x+1;
  startSequence(x, req, res);
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0401",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findById(req.params.id)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("str0501",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.find({product: req.query.product})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0601",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.find({trans_id: req.params.transid})
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0701",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findOrigin = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.find({origin: req.params.origin})
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0801",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransIn = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.aggregate([
    { $match: {
      product: ObjectId(req.params.product)
    }},
    {
      $group:
      {
        _id: { product: "$product" },
        totalLine: { $sum: 1 },
        totalQin: { $sum: "$qin" }
      }
    }
    ])
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("str0901",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransOut = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.aggregate([
    { $match: {
      product: ObjectId(req.params.product)
    }},
    {
      $group:
      {
        _id: { product: "$product" },
        totalLine: { $sum: 1 },
        totalQout: { $sum: "$qout" }
      }
    }
    ])
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("str1001",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.validateByTransid = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.find({trans_id: req.params.transid})
    .then(data => {
      startValidate(0, data, res);
    }).catch(err =>{console.error("str1101",err.message);res.status(500).send({message:err.message}); });
};

function startValidate(x, data, res){
  if(x > data.length-1){
    updateProductCache().then(upc => {
      res.send({message: "DONE"});
    }).catch(err => {console.error("str1201",err.message);res.status(500).send({message:err.message}); })
  }else{
    const stockmove = ({
      trans_id: data[x].trans_id,
      user: data[x].user,
      product: data[x].product,
      partner: data[x].partner,
      warehouse: data[x].warehouse,
      qin: data[x].qin,
      qout: data[x].qout,
      uom: data[x].uom,
      date: data[x].date
    });
    Stockmove.create(stockmove).then(dataa => {
      Stockrequest.findByIdAndRemove(data[x]._id, { useFindAndModify: false }).then(datab => {
        if((data[x].qin && !data[x].qout) || (data[x].qin && data[x].qout == 0)) {xx = "1-3001"; yy = "1-3901"; qt = data[x].qin;}
        else {xx = "1-3901"; yy = "1-3001"; qt = data[x].qout;}
        Product.findById(data[x].product).then(prod => {
          let prodname = prod.name;
          inputJournalStock(xx, yy, qt, data[x], prodname).then(inputJour => {
            console.log(data[x].product, data[x].partner, data[x].warehouse, data[x]);
            insertUpdateQop(data[x].product, data[x].partner, data[x].warehouse, data[x]).then(qop => {
              sequencingValidate(x, data, res)
            }).catch(err => {console.error("str1202",err.message);res.status(500).send({message:err.message}); })
          }).catch(err => {console.error("str1203",err.message);res.status(500).send({message:err.message}); })
        }).catch(err => {console.error("str1204",err.message);res.status(500).send({message:err.message}); })
      }).catch(err => {console.error("str1205",err.message);res.status(500).send({message:err.message}); })
    }).catch(err => {console.error("str1206",err.message);res.status(500).send({message:err.message}); })
  }
}

function sequencingValidate(x, data, res){
  x=x+1;
  startValidate(x, data, res);
}