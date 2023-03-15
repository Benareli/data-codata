const db = require("../../../models");
const {id,coa,cache,journal,qop} = require("../../../function");
const { compare } = require('../../../function/key.function');
const Stockmove = db.stockmoves;
const Journal = db.journals;
const Entry = db.entrys;
const Product = db.products;
const ProductCatAcc = db.productcataccs;
const Partner = db.partners;
const Uom = db.uoms;
const Warehouse = db.warehouses;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
const Log = db.logs;
var journid, journalid, journalcount;
var xx, yy, qt;
var qty, oriqty, uom_id, oriuom_id, cost, oricost, entries, type;

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

async function inputJournal(data) {
  const jour1 = await journal.inputJournal(data);
  return jour1;
}

async function insertUpdateQop(type, productid, partnerid, whid, data) {
  const qop1 = await qop.insertUpdateQop(type, productid, partnerid, whid, data);
  return qop1;
}

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.product_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  Product.findByPk(req.body.product_id).then(prod => {
    if(prod.uom_id != req.body.uom_id){
      Uom.findByPk(req.body.uom).then(uom => {
        if(req.body.qin) {
          qty = req.body.qin * uom.ratio;
          uom_id = prod.uom_id;
          cost = req.body.cost / uom.ratio;
        }
        if(data.qout) {
          qty = req.body.qout * uom.ratio;
          uom_id = prod.uom_id;
          cost = req.body.cost * uom.ratio;
        }
        oriqty = req.body.qin;
        oriuom_id = req.body.uom_id;
        oricost = req.body.cost;
        createSM(req, res, qty);
      }).catch(err => {console.error("sm0002",err.message);res.status(500).send({message:err.message}); });
    }else{
      qty = req.body.qin;
      uom_id = req.body.uom_id;
      cost = req.body.cost;
      createSM(req, res, qty);
    }
  }).catch(err => {console.error("sm0001",err.message);res.status(500).send({message:err.message}); });
};

function createSM(req, res, qty) {
  const stockmove = ({
    trans_id: req.body.trans_id,
    product_id: req.body.product_id,
    partner_id: req.body.partner_id,
    warehouse_id: req.body.warehouse_id,
    qin: qty,
    qout: req.body.qout,
    uom_id: uom_id,
    date: req.body.date,
    company_id: req.body.company_id,
    user_id: req.body.user_id,
    cost: cost,
    oriqin: oriqty,
    oriuom_id: oriuom_id,
    oricost: oricost
  });
    /*Old Price * Quantity valued at Old Price) + 
    (Quantity received in last shipment * Price of the product in last shipment)) / 
    (Quantity valued at old price + quantity received in last shipment*/
  Stockmove.create(stockmove).then(data => {
    if(req.body.req){
      res.send(data);
    }else{
      insertUpdateQop("in", req.body.product_id, req.body.partner_id, req.body.warehouse_id, req.body).then(qop => {
        updateProductCache().then(upc => {
          insertAcc(req.body, res, cost);
        }).catch(err => {console.error("sm0101",err.message);res.status(500).send({message:err.message}); });
      }).catch(err => {console.error("sm0102",err.message);res.status(500).send({message:err.message}); });
    }
  }).catch(err => {console.error("sm0103",err.message);res.status(500).send({message:err.message}); });
};

function insertAcc(req, res, cost) {
  entries = [];
  Product.findByPk(req.product_id).then(p1 => {
    ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.company_id}, include: [
      {model: Coa, as: "revenues"},
      {model: Coa, as: "costs"},
      {model: Coa, as: "incomings"},
      {model: Coa, as: "outgoings"},
      {model: Coa, as: "inventorys"},
    ], raw: true, nest: true}).then(p2 => {
      if (req.qin && (!req.qout || req.qout == 0)) {
        var inventoryAccount = p2.inventorys;
        var incomingAccount = p2.incomings;
        var ncost = cost * req.qin;
      } else {
        var inventoryAccount = p2.incomings;
        var incomingAccount = p2.inventorys;
        var ncost = cost * req.quot;
      }

      entries.push({label: p1.name, debit: ncost, debits: inventoryAccount, date: req.date});
      entries.push({label: p1.name, credit: ncost, credits: incomingAccount, date: req.date});

      const inJournal = {
        date: req.date,
        type: "stock",
        origin: req.trans_id,
        entry: entries,
        amount: ncost,
        company: req.company_id,
        user: req.user_id
      };
      if(entries.length >= 2){
        inputJournal(inJournal).then(inputJour => {
          res.send({message:"done"});
        }).catch(err =>{console.error("sm0103",err.message);res.status(500).send({message:err.message}); });
      }else{
        insertAcc(req, res, cost)
      }
    }).catch(err =>{console.error("sm0101",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("sm0102",err.message);res.status(500).send({message:err.message}); });
  }

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findAll({ include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "oriuoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findByPk(req.params.id, { include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "oriuoms"}
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("sm0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findAll({where:{product_id: req.params.product},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "oriuoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0401",err.message);res.status(500).send({message:err.message}); });
};

exports.findTransId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findAll({where:{trans_id: req.params.transid},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "oriuoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0501",err.message);res.status(500).send({message:err.message}); });
};

exports.findOrigin = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findAll({where:{origin: req.params.origin},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "oriuoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0601",err.message);res.status(500).send({message:err.message}); });
};

exports.findTransIn = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  db.sequelize.query
    ('SELECT COUNT(public.stockmoves.id) as totalLine, SUM(public.stockmoves.qin) as totalQin FROM public.stockmoves ' +
      'WHERE public.stockmoves.product_id = ' + req.params.product +
      'AND public.stockmoves.qin > 0',{raw: true, nest: true})
    .then(result => {
      res.send(result);
    }).catch(err =>{console.error("sm0701",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findTransOut = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  db.sequelize.query
    ('SELECT COUNT(public.stockmoves.id) as totalLine, SUM(public.stockmoves.qout) as totalQout FROM public.stockmoves ' +
      'WHERE public.stockmoves.product_id = ' + req.params.product +
      'AND public.stockmoves.qout > 0',{raw: true, nest: true})
    .then(result => {
      res.send(result);
    }).catch(err =>{console.error("sm0801",err.message);res.status(500).send({message:err.message}); });
};

// Retrieve all from the database.
exports.findByWh = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockmove.findAll({where:{warehouse_id: req.params.wh},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "oriuoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sm0901",err.message);res.status(500).send({message:err.message}); });
};
