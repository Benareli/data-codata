const db = require("../../../models");
const { compare } = require('../../../function/key.function');
const {id,coa} = require("../../../function");
const Pos = db.poss;
const Posdetail = db.posdetails;
const Id = db.ids;
const Stockmove = db.stockmoves;
const Product = db.products;
const Bundle = db.bundles;
const Warehouse = db.warehouses;
const Uom = db.uoms;
const Qop = db.qops;
const Qof = db.qofs;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Log = db.logs;
var costA = 0;
var amountx = 0;
var prefixes = '';
var transid = '';
var journid, journalid, journalcount;

async function getUpdateTransId() {
  const res1 = await id.getUpdateTransId();
  return res1;
}

async function getCoa2(coa1, coa2) {
  const res2 = await coa.getCoa2(coa1, coa2);
  return res2;
}

// Create and Save new
exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  // Validate request
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if(req.body.fg){
    insertPOSDetail(req.body, res);
  }
  if(req.body.isStock=="true"&&!req.body.fg){
    const posdetail = ({
      order_id: req.body.order_id, qty: req.body.qty, uom: req.body.uom, include: req.body.include,
      price_unit: req.body.price_unit, discount: req.body.discount, tax: req.body.tax, subtotal: req.body.subtotal,
      product: req.body.product, warehouse: req.body.warehouse, date: req.body.date,
      store: req.body.store,
    });
    Posdetail.create(posdetail).then(dataa => {
      Pos.findOneAndUpdate({order_id: req.body.order_id}, {$push: {pos_detail: dataa._id}}, { useFindAndModify: false })
        .then(datab => { 
          if(req.body.partner=="null" || !req.body.partner){
           const qof1 = ({qof: 0-Number(req.body.qty), product: req.body.product, 
              warehouse: req.body.warehouse, uom: req.body.uom});
            Qof.create(qof1).then(datac => {
              Stockmove.findOne({origin: req.body.order_id}).then(smfind =>{
                if(smfind){
                  const stockmove = ({
                    trans_id: smfind.trans_id,
                    user: req.body.user,
                    product: req.body.product,
                    warehouse: req.body.warehouse,
                    origin: req.body.order_id,
                    qout: req.body.qty,
                    uom: req.body.uom,
                    date: req.body.date,
                  });
                  Stockmove.create(stockmove).then(datad => {
                    findCost(req.body, res);
                    }).catch(err => {console.error("posdet0101",err.message);res.status(500).send({message:err.message}); });
                }else{
                  getUpdateTransId().then(restransid => {
                    transid = restransid;
                    const stockmove = ({
                      trans_id: transid,
                      user: req.body.user,
                      product: req.body.product,
                      warehouse: req.body.warehouse,
                      origin: req.body.order_id,
                      qout: req.body.qty,
                      uom: req.body.uom,
                      date: req.body.date,
                    });
                    Stockmove.create(stockmove).then(datad => {
                      findCost(req.body, res);
                      }).catch(err => {console.error("posdet0102",err.message);res.status(500).send({message:err.message}); });
                    }).catch(err =>{console.error("posdet0103",err.message);res.status(500).send({message:err.message}); });
                }
              }).catch(err =>{console.error("posdet0104",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("posdet0105",err.message);res.status(500).send({message:err.message}); });
          }else if(req.body.partner!="null"){
            const qof1 = ({qof: 0-Number(req.body.qty), product: req.body.product, 
              partner: req.body.partner, warehouse: req.body.warehouse, uom: req.body.uom});
            Qof.create(qof1).then(datac => {
              Stockmove.findOne({origin: req.body.order_id}).then(smfind =>{
                if(smfind){
                  const stockmove = ({
                    trans_id: smfind.trans_id,
                    user: req.body.user,
                    product: req.body.product,
                    warehouse: req.body.warehouse,
                    partner: req.body.partner,
                    origin: req.body.order_id,
                    qout: req.body.qty,
                    uom: req.body.uom,
                    date: req.body.date,
                  });
                  Stockmove.create(stockmove).then(datad => {
                    findCost(req.body, res);
                    }).catch(err => {console.error("posdet0101",err.message);res.status(500).send({message:err.message}); });
                }else{
                  getUpdateTransId().then(restransid => {
                    transid = restransid;
                    const stockmove = ({
                      trans_id: transid,
                      user: req.body.user,
                      product: req.body.product,
                      warehouse: req.body.warehouse,
                      partner: req.body.partner,
                      origin: req.body.order_id,
                      qout: req.body.qty,
                      uom: req.body.uom,
                      date: req.body.date,
                    });
                    Stockmove.create(stockmove).then(datad => {
                      findCost(req.body, res);
                      }).catch(err => {console.error("posdet0102",err.message);res.status(500).send({message:err.message}); });
                    }).catch(err =>{console.error("posdet0103",err.message);res.status(500).send({message:err.message}); });
                }
              }).catch(err =>{console.error("posdet0104",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("posdet0105",err.message);res.status(500).send({message:err.message}); });
          }   
      });
    });
  }else if(req.body.isStock=="false"&&!req.body.fg){
    const posdetail = ({
      order_id: req.body.order_id,
      qty: req.body.qty,
      uom: req.body.uom,
      price_unit: req.body.price_unit,
      discount: req.body.discount,
      tax: req.body.tax,
      include: req.body.include,
      subtotal: req.body.subtotal,
      product: req.body.product,
      warehouse: req.body.warehouse,
      date: req.body.date,
      store: req.body.store,
    });
    Posdetail.create(posdetail).then(dataa => { 
      Pos.findOneAndUpdate({order_id: req.body.order_id}, {$push: {pos_detail: dataa._id}}, { useFindAndModify: false })
        .then(datab => { 
          res.send(datab);
        }).catch(err =>{console.error("posdet0109",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("posdet0110",err.message);res.status(500).send({message:err.message}); });
  }
};

function insertPOSDetail(reqs,res){
  const posdetail2 = ({
    order_id: reqs.order_id, qty: reqs.qty, uom: reqs.uom,
    price_unit: reqs.price_unit, discount: reqs.discount, tax: reqs.tax, subtotal: reqs.subtotal,
    product: reqs.product, warehouse: reqs.warehouse, date: reqs.date,
    store: reqs.store,
  });
  Posdetail.create(posdetail2).then(dataz => {
    Pos.findOneAndUpdate({order_id: reqs.order_id}, {$push: {pos_detail: dataz._id}}, { useFindAndModify: false })
      .then(datay => { 
        startSequence(reqs, res);
    }).catch(err => {console.error("posdet0201",err.message);res.status(500).send({message:err.message}); });
  }).catch(err => {console.error("posdet0202",err.message);res.status(500).send({message:err.message}); });
}

function startSequence(reqs, res){
  Bundle.find({bundle: reqs.product})
    .then(dat => {
      playSequencing(0, reqs, dat, res);
  }).catch(err => {console.error("posdet0301",err.message);res.status(500).send({message:err.message}); });
}

function playSequencing(x, reqs, dat, res){
  if(dat[x]){
   if(reqs.partner=="null" || !reqs.partner){
    const qof1 = ({qof: 0-(Number(reqs.qty) * Number(dat[x].qty)), product: dat[x].product, 
      warehouse: reqs.warehouse, uom: reqs.uom});
      Qof.create(qof1).then(datac => {
        getUpdateTransId().then(restransid => {
          transid = restransid;
          const stockmove = ({
            trans_id: transid,
            user: reqs.user,
            product: dat[x].product,
            warehouse: reqs.warehouse,
            origin: reqs.order_id,
            qout: (Number(reqs.qty) * Number(dat[x].qty)),
            uom: reqs.uom,
            date: reqs.date
          });
          Stockmove.create(stockmove).then(datad => {
            findCostBundle(x, reqs, dat, res);
            }).catch(err => {console.error("posdet0401",err.message);res.status(500).send({message:err.message});
          }).catch(err =>{console.error("posdet0402",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("posdet0403",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("posdet0404",err.message);res.status(500).send({message:err.message}); });
    }else if(reqs.partner!="null"){
      const qof1 = ({qof: 0-(Number(reqs.qty) * Number(dat[x].qty)), product: dat[x].product, 
        partner: reqs.partner, warehouse: reqs.warehouse, uom: reqs.uom});
      Qof.create(qof1).then(datac => {
        getUpdateTransId().then(restransid => {
          transid = restransid;
          const stockmove = ({
            trans_id: transid,
            user: reqs.user,
            product: dat[x].product,
            partner: reqs.partner,
            warehouse: reqs.warehouse,
            origin: reqs.order_id,
            qout: (Number(reqs.qty) * Number(dat[x].qty)),
            uom: reqs.uom,
            date: reqs.date
          });
          Stockmove.create(stockmove).then(datad => {
              findCostBundle(x, reqs, dat, res);
            }).catch(err => {console.error("posdet0405",err.message);res.status(500).send({message:err.message});
          }).catch(err =>{console.error("posdet0406",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("posdet0407",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("posdet0408",err.message);res.status(500).send({message:err.message}); });
    }
  }else{
    res.status(200).send({message:"All bundle data in!"});
  }
}

function sequencing(x, reqs, dat, res){
  x=x+1;
  playSequencing(x, reqs, dat, res);
}

function findCostBundle(x, reqs, dat, res){
  Product.findById(dat[x].product).then(data => {
    costA = data.cost;
    let prodname = data.name;
    Journal.findOne({_id: reqs.ids}).then(ids => {
      var journ_id = ids._id;
      amountx = ids.amount;
      journid = ids.journal_id;
      getCoa2('1-3001', '5-1001').then(coa2 => {
        let oo = coa2[0];
        let pp = coa2[1];
        const ent1 = ({journal_id: journid, label: prodname,
          debit_acc: pp, debit: costA, date: reqs.date})
        Entry.create(ent1).then(datah => {
          const ent2 = ({journal_id: journid, label: prodname,
            credit_acc: oo, credit: costA, date: reqs.date})
          Entry.create(ent2).then(datai => {
            Journal.findOneAndUpdate({id: journ_id}, 
              {$push: {entries: [datah._id,datai._id]}, amount: amountx + costA}, {useFindAndModify: false})
              .then(dataj => {
                o=null,p=null,oo=null,pp=null;
                sequencing(x, reqs, dat, res);
              }).catch(err =>{console.error("posdet0501",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("posdet0502",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("posdet0503",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("posdet0504",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("posdet0505",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("posdet0506",err.message);res.status(500).send({message:err.message}); });
}

function findCost(req, res) {
  if(req.meth){
    Product.findById(req.product).then(datax => {
      costA = datax.cost;
      insertAcc(req, res);
    })
  }else{
    Qop.findById(req.qop).then(datax => {
      costA = datax.cost;
      insertAcc(req, res);
    })
  }
}

function insertAcc(req, res) {
  Product.findById(req.product).then(prod => {
    let prodname = prod.name;
    Journal.findOne({_id: req.ids}).then(ids => {
      var journ_id = ids._id;
      amountx = ids.amount;
      journid = ids.journal_id;
      getCoa2('1-3001', '5-1001').then(coa2 => {
        let oo = coa2[0];
        let pp = coa2[1];
        const ent1 = ({journal_id: journid, label: prodname,
          debit_acc: pp, debit: costA ? costA: 0, date: req.date})
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: prodname,
            credit_acc: oo, credit: costA ? costA: 0, date: req.date})
          Entry.create(ent2).then(datab => {
            Journal.findOneAndUpdate({_id: journ_id}, 
              {$push: {entries: [dataa._id,datab._id]}, amount: costA + amountx}, {useFindAndModify: false})
              .then(datac => {
                o=null,p=null,oo=null,pp=null;
                res.send(datac);
              }).catch(err =>{console.error("posdet0601",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("posdet0602",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("posdet0603",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("posdet0604",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("posdet0605",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("posdet0606",err.message);res.status(500).send({message:err.message}); });
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Posdetail.find(condition)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("posdet0701",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Posdetail.findById(req.params.id)
    .populate({ path: 'product', model: Product })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("posdet0801",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  
  Posdetail.aggregate([
    { $match: {
      product: ObjectId(req.params.product)
    }},
    {
      $group:
      {
        _id: { product: "$product" },
        totalLine: { $sum: 1 },
        totalQty: { $sum: "$qty" }
      }
    }
    ])
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("posdet0901",err.message);res.status(500).send({message:err.message}); });
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
  Posdetail.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("posdet1001",err.message);res.status(500).send({message:err.message}); });
};


// Find a single with an desc
exports.report = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Posdetail.aggregate([
      { $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "map_product"
      }},
      { $unwind: "$map_product" },
      { $lookup: {
        from: "productcats",
        localField: "map_product.category",
        foreignField: "_id",
        as: "map_category"
      }},
      { $unwind: "$map_category" },
      { $lookup: {
        from: "brands",
        localField: "map_product.brand",
        foreignField: "_id",
        as: "map_brand"
      }},
      { $unwind: {path: "$map_brand", preserveNullAndEmptyArrays: true }},
      { $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "map_store"
      }},
      { $unwind: "$map_store" },
      {
        $project: {
          _id: 0,
          "store": "$map_store.store_name",
          "order_id": "$order_id",
          "qty": "$qty",
          "product": "$map_product.name",
          "category": "$map_category.description",
          "brand": "$map_brand.description",
          "price_unit": "$price_unit",
          "discount": "$discount",
          "tax": "$tax",
          "subtotal": "$subtotal",
          "date": "$date"
        }
      },
    ])
    .then(result => {
      //console.log(result);
      res.send(result);
    }).catch(err =>{console.error("posdet1101",err.message);res.status(500).send({message:err.message}); });
};