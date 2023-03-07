const db = require("../models");
const {id,coa,cache,journal,qop} = require("../function");
const { compare } = require('../function/key.function');
const Purchase = db.purchases;
const Purchasedetail = db.purchasedetails;
const Qop = db.qops;
const Id = db.ids;
const Uom = db.uoms;
const Product = db.products;
const Partner = db.partners;
const Warehouse = db.warehouses;
const Qof = db.qofs;
const Stockmove = db.stockmoves;
const Coa = db.coas;
const Entry = db.entrys;
const Journal = db.journals;
const Company = db.companys;
var transid, transferid, trasnfercount;
var journid, journalid, journalcount;
var y1, x, qin;
var qty, oriqty, uom_id, oriuom_id, cost, oricost;

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

exports.create = (req, res) => {
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
    uom_id: req.body.uom,
    price_unit: req.body.price_unit,
    discount: req.body.discount,
    tax: req.body.tax,
    subtotal: req.body.subtotal,
    partner_id: req.body.partner,
    product_id: req.body.product,
    warehouse_id: req.body.warehouse,
    date: req.body.date,
    company_id: req.body.company
  });
  Purchasedetail.create(purchasedet).then(dataa => { 
    res.send(dataa);
  }).catch(err =>{console.error("purd0102",err.message);res.status(500).send({message:err.message}); });
};

exports.findAll = (req, res) => {
  const purchase_id = req.query.purchase_id;
  var condition = purchase_id ? { purchase_id: { $regex: new RegExp(purchase_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.findAll({ include: [
      {model: Purchase, as: "purchases"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("purd0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.findByPk(req.params.id,{ include: [
      {model: Purchase, as: "purchases"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("purd0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findByPOId = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.findAll({where:{purchase_id: req.params.po},
    include: [
      {model: Purchase, as: "purchases"},
      {model: Partner, as: "partners"},
      {model: Warehouse, as: "warehouses"},
      {model: Product, as: "products"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("purd0401",err.message);res.status(500).send({message:err.message}); });
};

exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }
  Purchasedetail.update(req.body, {where:{id:req.params.id}})
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
  checkUom(req, res);
};

function checkUom(req, res){
  Product.findByPk(req.body[x].products.id).then(prod => {
    if(prod.uom_id != req.body[x].uoms.id){
      Uom.findByPk(req.body[x].uoms.id).then(uom => {
        qty = req.body[x].qty_rec * uom.ratio;
        uom_id = prod.uom_id;
        cost = req.body[x].subtotal / req.body[x].qty * req.body[x].qty_rec / uom.ratio;
        oriqty = req.body[x].qty_rec;
        oriuom_id = req.body[x].uom_id;
        oricost = req.body[x].subtotal / req.body[x].qty * req.body[x].qty_rec;
        startProcess(req, res);
      }).catch(err => {console.error("sm0002",err.message);res.status(500).send({message:err.message}); });
    }else{
      qty = req.body[x].qty_rec;
      uom_id = req.body[x].uom_id;
      cost = req.body[x].subtotal / req.body[x].qty * req.body[x].qty_rec;
      startProcess(req, res);
    }
  }).catch(err => {console.error("sm0001",err.message);res.status(500).send({message:err.message}); });
}

function startProcess(req, res){
  if(req.body[x].qty_rec > 0){
    getTransId().then(tids => {
      transid = tids[0];
      transferid = tids[1];
      transfercount = tids[2];
      const stockmove = ({
        trans_id: transid,
        user_id: req.params.id,
        product_id: req.body[x].products.id,
        warehouse_id: req.params.wh,
        origin: req.body[x].purchases.purchase_id,
        qin: qty,
        uom_id: uom_id,
        date: req.params.date,
        company_id: req.body.company_id,
        cost: cost,
        oriqin: oriqty,
        oriuom_id: oriuom_id,
        oricost: oricost
      });
      Stockmove.create(stockmove).then(datad => {
        insertUpdateQop(req.body[x].products.id, req.params.partner, req.params.wh, req.body[x]).then(qop => {
          Purchasedetail.findByPk(req.body[x].id).then(pd => {
            if(oriqty) qty = oriqty;
            Purchasedetail.update({qty_done: pd.qty_done + qty}, {where:{id:req.body[x].id}}).then(pdu => {
              updateProductCache().then(upc => {
                insertAcc(req, res);
              }).catch(err =>{console.error("purd0601",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("purd0602",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("purd0603",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("purd0604",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("purd0605",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("purd0606",err.message);res.status(500).send({message:err.message}); }); 
  }else {
    sequencing(req,res);
  }
}

function insertAcc(req, res) {
  inputJournal("2-3001", "1-3001", cost, cost, cost,
    req.body[x].products.name, req.body[x].products.name, "transfer", req.params.date).then(inputJour => {
      sequencing(req, res);
    }).catch(err =>{console.error("purd0801",err.message);res.status(500).send({message:err.message}); });
}

function sequencing(req, res){
  if(x==req.body.length-1){
    Id.update({transfer_id: transfercount+1}, {where:{id:transferid}})
      .then(datae => {
          res.send({message: "DONE!"});
        }).catch(err =>{console.error("purd0690",err.message);res.status(500).send({message:err.message}); });
  }else{
    x=x+1;
    checkUom(req, res);
  }
}

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.destroy({where:{id:req.params.id}})
    .then(num => {
      console.log(num);
      if(num === 1) {
        res.send({message:'done'})
      }
      else {
        res.send({message:'failed'})
      }
    }).catch(err =>{console.error("purd0901",err.message);res.status(500).send({message:err.message}); });
};

exports.deleteAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Purchasedetail.destroy({})
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