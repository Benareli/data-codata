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
var transid;
var sqin, sqout, soriqin, soriqout, suom, soriuom, scost, soricost;

async function getUpdateTransId() {
  const res1 = await id.getUpdateTransId();
  return res1;
}

async function updateProductCache() {
  const res2 = await cache.updateProductCache();
  return res2;
}

async function inputJournalStock(xx, yy, qt, req, reqcost, prodname) {
  const jour1 = await journal.inputJournalStock(xx, yy, qt, req, reqcost, prodname);
  return jour1;
}

async function insertUpdateQop(productid, partnerid, whid, data) {
  const qop1 = await qop.insertUpdateQop(productid, partnerid, whid, data);
  return qop1;
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
    }).catch(err =>{console.error("str0101",err.message);res.status(500).send({message:err.message}); });
}

function startSequence(x, req, res){
  if(req.body[x]){
    if(req.body[x].type == "In"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product_id: req.body[x].prodid,
        warehouse_id: req.body[x].to,
        qin: req.body[x].qty,
        uom_id: req.body[x].uomid,
        date: req.body[x].date,
        company_id: req.body[x].company,
        user_id: req.body[x].user,
        cost: req.body[x].cost,
        req: true,
      });
      Stockrequest.create(stockmove).then(data => {
        sequencing(x, req, res);
      }).catch(err => {console.error("str0201",err.message);res.status(500).send({message:err.message}); });
    }else if(req.body[x].type == "Out"){
      const stockmove = ({
        trans_id: transid,
        user: req.body[x].user,
        product_id: req.body[x].prodid,
        warehouse_id: req.body[x].from,
        qout: req.body[x].qty,
        uom_id: req.body[x].uomid,
        date: req.body[x].date,
        company_id: req.body[x].company,
        user_id: req.body[x].user,
        cost: req.body[x].cost,
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
        product_id: req.body[x].prodid,
        warehouse_id: req.body[x].from,
        qout: req.body[x].qty,
        uom_id: req.body[x].uomid,
        date: req.body[x].date,
        company_id: req.body[x].company,
        user_id: req.body[x].user,
        cost: req.body[x].cost,
        req: true,
      });
      Stockrequest.create(stockmove).then(data => {
        const stockmove = ({
          trans_id: transid,
          user: req.body[x].user,
          product_id: req.body[x].prodid,
          warehouse_id: req.body[x].to,
          qin: req.body[x].qty,
          uom_id: req.body[x].uomid,
          date: req.body[x].date,
          company_id: req.body[x].company,
          user_id: req.body[x].user,
          cost: req.body[x].cost,
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
    }).catch(err =>{console.error("str0401",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("str0501",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("str0601",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("str0701",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("str0801",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("str0901",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("str1001",err.message);res.status(500).send({message:err.message}); });
};

exports.validateByTransid = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Stockrequest.findAll({where:{trans_id: req.params.transid}})
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
    checkUom(data[x]).then(checker => {
      if(checker[1]==data[x].uom_id){
        soriqin = null; soriqout = null; soriuom = null; soricost = null;
        sqin = data[x].qin; sqout = data[x].qout; suom = data[x].uom_id; scost = data[x].cost;
      }else{
        soriqin = data[x].qin; soriqout = data[x].qout; soriuom = data[x].uom_id; soricost = data[x].cost;
        if(data[x].qin) sqin = checker[0];
        if(data[x].qout) sqout = checker[0];
        suom = checker[1]; scost = checker[2];
      }
      const stockmove = ({
        trans_id: data[x].trans_id,
        user: data[x].user,
        product_id: data[x].product_id,
        partner_id: data[x].partner_id,
        warehouse_id: data[x].warehouse_id,
        qin: sqin,
        qout: sqout,
        uom_id: suom,
        company_id: data[x].company_id,
        date: data[x].date,
        user_id: data[x].user_id,
        cost: scost,
        oriqin: soriqin,
        oriqout: soriqout,
        oriuom_id: soriuom,
        oricost: soricost
      });
      Stockmove.create(stockmove).then(dataa => {
        Stockrequest.destroy({where:{id:data[x].id}}).then(datab => {
          if((data[x].qin && !data[x].qout) || (data[x].qin && data[x].qout == 0)) {xx = "1-3001"; yy = "1-3901"; qt = sqin;}
          else {xx = "1-3901"; yy = "1-3001"; qt = sqout;}
          Product.findByPk(data[x].product_id).then(prod => {
            let prodname = prod.name;
            inputJournalStock(xx, yy, qt, data[x], scost, prodname).then(inputJour => {
              insertUpdateQop(data[x].product_id, data[x].partner_id, data[x].warehouse_id, data[x]).then(qop => {
                sequencingValidate(x, data, res)
              }).catch(err => {console.error("str1202",err.message);res.status(500).send({message:err.message}); })
            }).catch(err => {console.error("str1203",err.message);res.status(500).send({message:err.message}); })
          }).catch(err => {console.error("str1204",err.message);res.status(500).send({message:err.message}); })
        }).catch(err => {console.error("str1205",err.message);res.status(500).send({message:err.message}); })
      }).catch(err => {console.error("str1206",err.message);res.status(500).send({message:err.message}); })
    }).catch(err => {console.error("str1207",err.message);res.status(500).send({message:err.message}); })
  }
}

function sequencingValidate(x, data, res){
  x=x+1;
  startValidate(x, data, res);
}

function checkUom(data) {
  return new Promise((resolve, reject) =>{
    Product.findByPk(data.product_id).then(prod => {
      if(data.uom_id != prod.uom_id){
        Uom.findByPk(data.uom_id).then(uomz => {
          let cost;
          if(data.qin) {
            data.qty = data.qin;
            cost = data.cost / uomz.ratio;
          }
          if(data.qout) {
            data.qty = data.qout;
            cost = data.cost * uomz.ratio;
          }
          let qty = data.qty * uomz.ratio;
          let uom_id = prod.uom_id;
          resolve ([qty, uom_id, cost]);
        })
      }else{
        if(data.qin) data.qty = data.qin;
          if(data.qout) data.qty = data.qout;
        let qty = data.qty;
        let uom_id = data.uom_id;
        let cost = data.cost;
        resolve ([qty, uom_id, cost]);
      }
    }).catch(err =>{console.error("qopf0116",err.message);reject(err); });
  })
}