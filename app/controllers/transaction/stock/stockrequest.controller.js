const db = require("../../../models");
const {id,coa,cache,journal,stock} = require("../../../function");
const { compare } = require('../../../function/key.function');
const Stockrequest = db.stockrequests;
const Stockmove = db.stockmoves;
const Lot = db.lots;
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
var transid;
var sqty_rec, soriqty_rec, suom, soriuom, scost, soricost, type;

async function getUpdateTransId() {
  const res1 = await id.getUpdateTransId();
  return res1;
}

async function updateProductCache() {
  const res2 = await cache.updateProductCache();
  return res2;
}

async function inputJournal(data) {
  const jour1 = await journal.inputJournal(data);
  return jour1;
}

async function insertUpdateStock(type, productid, partnerid, whid, data) {
  const stock1 = await stock.insertUpdateStock(type, productid, partnerid, whid, data);
  return stock1;
}

exports.create = (req, res) => {
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
    }).catch(err =>{console.error("str0101",err);res.status(500).send({message:err}); });
}

function startSequence(x, req, res){
  if(req.body[x]){
    if(req.body[x].type == "In"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product_id: req.body[x].prodid,
        warehouse_id: req.body[x].to,
        qty_rec: req.body[x].qty,
        uom_id: req.body[x].uomid,
        date: req.body[x].date,
        company_id: req.body[x].company,
        user_id: req.body[x].user,
        cost: req.body[x].cost,
        req: true,
        type: req.body[x].type.toLowerCase(),
      });
      Stockrequest.create(stockmove).then(data => {
        sequencing(x, req, res);
      }).catch(err => {console.error("str0201",err);res.status(500).send({message:err}); });
    }else if(req.body[x].type == "Out"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product_id: req.body[x].prodid,
        warehouse_id: req.body[x].from,
        qty_rec: req.body[x].qty,
        uom_id: req.body[x].uomid,
        date: req.body[x].date,
        company_id: req.body[x].company,
        user_id: req.body[x].user,
        cost: req.body[x].cost,
        req: true,
        type: req.body[x].type.toLowerCase(),
      });
      Stockrequest.create(stockmove).then(data => {
          sequencing(x, req, res);
        }).catch(err => {console.error("str0301",err);res.status(500).send({message:err}); });
    }
    else if(req.body[x].type == "Internal"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product_id: req.body[x].prodid,
        warehouse_id: req.body[x].from,
        qty_rec: req.body[x].qty,
        uom_id: req.body[x].uomid,
        date: req.body[x].date,
        company_id: req.body[x].company,
        user_id: req.body[x].user,
        cost: req.body[x].cost,
        req: true,
        type: req.body[x].type.toLowerCase(),
      });
      Stockrequest.create(stockmove).then(data => {
        const stockmove = ({
          trans_id: transid,
          user: req.body[x].user,
          product_id: req.body[x].prodid,
          warehouse_id: req.body[x].to,
          qty_rec: req.body[x].qty,
          uom_id: req.body[x].uomid,
          date: req.body[x].date,
          company_id: req.body[x].company,
          user_id: req.body[x].user,
          cost: req.body[x].cost,
          req: true,
          type: req.body[x].type,
        });
        Stockrequest.create(stockmove).then(data => {
          sequencing(x, req, res);
        }).catch(err => {console.error("str0302",err);res.status(500).send({message:err}); })
      }).catch(err => {console.error("str0303",err);res.status(500).send({message:err}); })
    }
  }else{
    res.send({message: "Stock Request done"})
  }
}

function sequencing(x, req, res){
  x=x+1;
  startSequence(x, req, res);
}

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({ include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0401",err);res.status(500).send({message:err}); });
};

exports.findAllByComp = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({where:{company_id:req.params.comp}, include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0401",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findByPk(req.params.id, { include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"}
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("str0501",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({where:{product: req.query.product},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0601",err);res.status(500).send({message:err}); });
};

exports.findTransId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({where:{trans_id: req.params.transid},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0701",err);res.status(500).send({message:err}); });
};

exports.findOrigin = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({where:{origin: req.params.origin},
    include: [
      {model: Product, as: "products"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Uom, as: "uoms"}
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("str0801",err);res.status(500).send({message:err}); });
};

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
    }).catch(err =>{console.error("str0901",err);res.status(500).send({message:err}); });
};

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
    }).catch(err =>{console.error("str1001",err);res.status(500).send({message:err}); });
};

exports.validateByTransid = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({where:{trans_id: req.params.transid}})
    .then(data => {
      startValidate(0, data, res);
    }).catch(err =>{console.error("str1101",err);res.status(500).send({message:err}); });
};

function startValidate(x, data, res){
  if(x > data.length-1){
    updateProductCache().then(upc => {
      res.send({message: "DONE"});
    }).catch(err => {console.error("str1201",err);res.status(500).send({message:err}); })
  }else{
    checkUom(data[x]).then(checker => {
      let stockmoves = ({
        trans_id: data[x].trans_id,
        product_id: data[x].product_id,
        partner_id: data[x].partner_id,
        warehouse_id: data[x].warehouse_id,
        uom_id: checker[1],
        company_id: data[x].company_id,
        date: data[x].date,
        user_id: data[x].user_id,
        cost: checker[2],
        oriuom_id: soriuom,
        oricost: soricost,
      });
      if(checker[1]==data[x].uom_id){
        soriqin = null; soriqout = null; soriuom = null; soricost = null;
        sqty_rec = data[x].qty_rec; suom = data[x].uom_id; scost = data[x].cost;
        if(data[x].type == 'in'){
          stockmoves['qin'] = data[x].qty_rec;
          processValidate(x, data, res, stockmoves);
        }else if(data[x].type == 'out') {
          stockmoves['qout'] = data[x].qty_rec;
          processValidate(x, data, res, stockmoves);
        }
      }else{
        if(data[x].type == 'in'){
          stockmoves['qin'] = checker[0];
          stockmoves['oriqin'] = data[x].qty_rec;
          stockmoves['oriuom'] = data[x].uom_id;
          stockmoves['oricost'] = data[x].cost;
          scost = data[x].cost;
          processValidate(x, data, res, stockmoves);
        }else if(data[x].type == 'out') {
          stockmoves['qout'] = checker[0];
          stockmoves['oriqout'] = data[x].qty_rec;
          stockmoves['oriuom'] = data[x].uom_id;
          stockmoves['oricost'] = data[x].cost;
          scost = data[x].cost;
          processValidate(x, data, res, stockmoves);
        }
      }
    }).catch(err => {console.error("str1207",err);res.status(500).send({message:err}); })
  }
}

function processValidate(x, data, res, stockmoves) {
  Stockmove.create(stockmoves).then(dataa => {
    insertUpdateStock(data[x].type, data[x].product_id, data[x].partner_id, data[x].warehouse_id, data[x]).then(qop => {
      Stockrequest.destroy({where:{id:data[x].id}}).then(datab => {
        insertAcc(x, data, res, data[x].type, data[x], scost)          
      }).catch(err => {console.error("str1202",err);res.status(500).send({message:err}); })
    }).catch(err => {console.error("str1203",err);res.status(500).send({message:err}); })
  }).catch(err => {console.error("str1204",err);res.status(500).send({message:err}); })
}

function sequencingValidate(x, data, res){
  x=x+1;
  startValidate(x, data, res);
}

function insertAcc(x, alldata, res, type, data, cost) {
  entries = [];
  Product.findByPk(data.product_id).then(p1 => {
    ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: data.company_id}, include: [
      {model: Coa, as: "revenues"},
      {model: Coa, as: "costs"},
      {model: Coa, as: "incomings"},
      {model: Coa, as: "outgoings"},
      {model: Coa, as: "inventorys"},
    ], raw: true, nest: true}).then(p2 => {
      entries.push({
        label: p1.name,
        date: data.date,
        ...(data.type=="in" ? {debits: p2.inventorys, debit: cost} : {debits: p2.outgoings, debit: cost}),
      });
      entries.push({
        label: p1.name,
        date: data.date,
        ...(data.type=="in" ? {credits: p2.incomings, credit: cost} : {credits: p2.inventorys, credit: cost}),
      });
      const insJournal = {
        date: data.date,
        type: "stock",
        origin: data.trans_id,
        entry: entries,
        amount: cost,
        company: data.company_id,
        user: data.user_id
      };
      if(entries.length >= 2){
        inputJournal(insJournal).then(inputJour => {
          sequencingValidate(x, alldata, res)
        }).catch(err =>{console.error("sracc0103",err);res.status(500).send({message:err}); });
      }else{
        insertAcc(x, alldata, res, type, data, cost);
      }
    }).catch(err =>{console.error("sracc0101",err); });
  }).catch(err =>{console.error("sracc0102",err); });
}

function checkUom(data) {
  return new Promise((resolve, reject) =>{
    Product.findByPk(data.product_id).then(prod => {
      if(data.uom_id != prod.uom_id){
        Uom.findByPk(data.uom_id).then(uomz => {
          let cost;
          if(data.type == "in") {
            cost = data.cost / uomz.ratio;
          }
          if(data.type == "out") {
            cost = data.cost * uomz.ratio;
          }
          let qty = data.qty_rec * uomz.ratio;
          let uom_id = prod.uom_id;
          resolve ([qty, uom_id, cost]);
        })
      }else{
        let qty = data.qty_rec;
        let uom_id = data.uom_id;
        let cost = data.cost;
        resolve ([qty, uom_id, cost]);
      }
    }).catch(err =>{console.error("stockf0116",err);reject(err); });
  })
}