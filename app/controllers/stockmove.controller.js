const db = require("../models");
const {id,coa,cache,journal,qop} = require("../function");
const { compare } = require('../function/key.function');
const Stockmove = db.stockmoves;
const Journal = db.journals;
const Entry = db.entrys;
const Product = db.products;
const Partner = db.partners;
const Uom = db.uoms;
const Warehouse = db.warehouses;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
const Log = db.logs;
const mongoose =  require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var journid;
var journalid;
var journalcount;
var xx;
var yy;
var qt;
//const mongoose = require("mongoose");

async function getUpdateJournalId() {
  const res1 = await id.getUpdateJournalId();
  return res1;
}

async function updateJournalId1() {
  const res2 = await id.updateJournalId1();
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
  if (!req.body.product) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create
  if(req.body.partner != "null"){
    const stockmove = ({
      trans_id: req.body.trans_id,
      user: req.body.user,
      product: req.body.product,
      partner: req.body.partner,
      warehouse: req.body.warehouse,
      qin: req.body.qin,
      qout: req.body.qout,
      uom: req.body.uom,
      date: req.body.date
    });
    /*Old Price * Quantity valued at Old Price) + 
    (Quantity received in last shipment * Price of the product in last shipment)) / 
    (Quantity valued at old price + quantity received in last shipment*/
    
    Stockmove.create(stockmove).then(data => {
      insertUpdateQop(req.body.product, req.body.partner, req.body.warehouse, req.body).then(qop => {
        updateProductCache().then(upc => {
          insertAcc(req.body, res);
        }).catch(err => {console.error("sm0101",err.message);res.status(500).send({message:err.message}); });
      }).catch(err => {console.error("sm0102",err.message);res.status(500).send({message:err.message}); });
    }).catch(err => {console.error("sm0103",err.message);res.status(500).send({message:err.message}); });
  }
  if(req.body.partner == "null"){
    const stockmove = ({
      trans_id: req.body.trans_id,
      user: req.body.user,
      product: req.body.product,
      warehouse: req.body.warehouse,
      qin: req.body.qin,
      qout: req.body.qout,
      uom: req.body.uom,
      date: req.body.date
    });
    Stockmove.create(stockmove).then(data => {
      insertUpdateQop(req.body.product, null, req.body.warehouse, req.body).then(qop => {
        updateProductCache().then(upc => {
          insertAcc(req.body, res);
        }).catch(err => {console.error("sm0104",err.message);res.status(500).send({message:err.message}); });
      }).catch(err => {console.error("sm0105",err.message);res.status(500).send({message:err.message}); });
    }).catch(err => {console.error("sm0106",err.message);res.status(500).send({message:err.message}); });
  }
};

function insertAcc(req, res) {
  if((req.qin && !req.qout) || (req.qin && req.qout == 0)) {xx = "1-3001"; yy = "1-3901"; qt = req.qin;}
  else {xx = "1-3901"; yy = "1-3001"; qt = req.qout;}
  Product.findById(req.product).then(prod => {
    let prodname = prod.name;
    inputJournalStock(xx, yy, qt, req, prodname).then(inputJour => {
      res.send(inputJour);
    }).catch(err =>{console.error("sm0101",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("sm0102",err.message);res.status(500).send({message:err.message}); });
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.find(condition)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0201",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findById(req.params.id)
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("sm0301",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.find({product: req.query.product})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0401",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.find({trans_id: req.params.transid})
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0501",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findOrigin = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.find({origin: req.params.origin})
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0601",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransIn = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.aggregate([
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
    }).catch(err =>{console.error("sm0701",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransOut = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.aggregate([
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
    }).catch(err =>{console.error("sm0801",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findByWh = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.find({warehouse: req.params.wh})
    .populate({ path: 'user', model: User })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0901",err.message);res.status(500).send({message:err.message}); });
};
