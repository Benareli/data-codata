const db = require("../../../models");
const {id,coa,journal,stock} = require("../../../function");
const { compare } = require('../../../function/key.function');
const Pos = db.poss;
const Posdetail = db.posdetails;
const Possession = db.possessions;
const Stockmove = db.stockmoves;
const Brand = db.brands;
const Partner = db.partners;
const Product = db.products;
const ProductCatAcc = db.productcataccs;
const Log = db.logs;
const User = db.users;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Id = db.ids;
var journid, journalid, journalcount;
var transid, entriesSM, entries;
var prepEntries = [{revenues: '', total: ''}];
var prepTax = [{taxs: '', tax: ''}]

async function getJournalId() {
  const res1 = await id.getJournalId();
  return res1;
}

async function updateJournalId2(journalid, journalcount) {
  const res2 = await id.updateJournalId2(journalid, journalcount);
  return res2;
}

async function getCoaPos() {
  const res3 = await coa.getCoaPos();
  return res3;
}

async function getTransId() {
  const res4 = await id.getTransId();
  return res4;
}

async function updateTransId(transferid, transfercount) {
  const res5 = await id.updateTransId(transferid, transfercount);
  return res5;
}

async function insertUpdateStock(type, productid, partnerid, whid, data) {
  const stock5 = await stock.insertUpdateStock(type, productid, partnerid, whid, data);
  return stock5;
}

async function inputJournal(data) {
  const jour1 = await journal.inputJournal(data);
  return jour1;
}

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const pos = ({
    order_id: req.body.order_id,
    date: req.body.date,
    disc_type: req.body.disc_type,
    discount: req.body.discount,
    amount_subtotal: req.body.amount_subtotal,
    amount_untaxed: req.body.amount_untaxed,
    amount_tax: req.body.amount_tax,
    amount_total: req.body.amount_total,
    partner_id: req.body.partner.length === 0 ? null : req.body.partner,
    user_id: req.body.user,
    open: req.body.open,
    store_id: req.body.store,
    warehouse_id: req.body.warehouse,
    company_id: req.body.company,
    //payment: [req.body.payment]
  });
  Pos.create(pos).then(dataa => { 
    createDetail(dataa.id, 0, req, res);
  }).catch(err =>{console.error("pos0101",err);res.status(500).send({message:err}); });
};

function createDetail(posid, x, req, res) {
  const posdet = ({
    order_id: req.body.order_id,
    qty: req.body.data[x].qty_rec,
    price_unit: req.body.data[x].price_unit,
    discount: req.body.data[x].discount,
    tax: req.body.data[x].tax,
    include: req.body.data[x].include,
    subtotal: req.body.data[x].subtotal,
    date: req.body.date,
    pos_id: posid,
    partner_id: req.body.partner.length === 0 ? null : req.body.partner,
    warehouse_id: req.body.warehouse,
    product_id: req.body.data[x].product,
    uom_id: req.body.data[x].uom_id,
    oriuom_id: req.body.data[x].oriuom ? req.body.data[x].oriuom : null,
    store_id: req.body.store,
    company_id: req.body.company_id
  });
  Posdetail.create(posdet).then(datab => {
    sequencing(posid, x, req, res);
  })
}

function sequencing(posid, x, req, res) {
  if(req.body.data[x+1]){
    x++;
    createDetail(posid, x, req, res);
  }else{
    getTransId().then(tids => {
      transid = tids;
      stockmoves(tids, posid, 0, req, res);
    }).catch(err =>{console.error("pos0201",err);res.status(500).send({message:err}); });
  }
}

function stockmoves(tids, posid, y, req, res){
  ProductCatAcc.findOne({where:{category_id: req.body.data[y].product_data.productcat_id, company_id: req.body.company}, include: [
    {model: Coa, as: "revenues"},
    {model: Coa, as: "outgoings"},
    {model: Coa, as: "costs"},
    {model: Coa, as: "inventorys"},
  ], raw: true, nest: true}).then(p2 => {
    if(y === 0){
      prepEntries.splice(0, 1);
      prepTax.splice(0, 1);
      prepEntries.push({
        revenues: p2.revenues, outgoings: p2.outgoings,
        costs: p2.costs, inventorys: p2.inventorys, 
        total: req.body.data[y].product_data.taxouts
          ? req.body.data[y].product_data.taxouts.include 
            ? req.body.data[y].subtotal - req.body.data[y].taxes
            : req.body.data[y].subtotal
          : req.body.data[y].subtotal, 
        cost: req.body.data[y].product_data.productcostcomps[0].cost
      })
      if(req.body.data[y].product_data.taxouts){
        prepTax.push({
          tax: req.body.data[y].taxes,
          taxs: req.body.data[y].product_data.taxouts
        })
      }
    }else{
      let foundEntry = prepEntries.find(pe => pe.revenues.id === p2.revenues.id);
      if (foundEntry) {
        foundEntry.total = foundEntry.total + req.body.data[y].subtotal;
        foundEntry.cost = foundEntry.cost + req.body.data[y].product_data.productcostcomps[0].cost
      }else{
        prepEntries.push({
          revenues: p2.revenues, tax: req.body.data[y].taxes, outgoings: p2.outgoings,
          costs: p2.costs, inventorys: p2.inventorys, total: req.body.data[y].subtotal, 
          cost: req.body.data[y].product_data.productcostcomps[0].cost
        })
      }
      let foundTax = req.body.data[y].product_data.taxouts
        ? prepTax.find(pt => pt.taxs.id === req.body.data[y].product_data.taxouts.id)
        : null;
      if (foundTax) {
        foundTax.tax = foundTax.tax + req.body.data[y].taxes;
      }else if(!foundTax && req.body.data[y].product_data.taxouts){
        prepTax.push({
          tax: req.body.data[y].taxes,
          taxs: req.body.data[y].product_data.taxouts
        })
      }
    }
    if(req.body.data[y].isStock){
      const stockmove = ({
        trans_id: tids[0],
        user_id: req.body.user,
        product_id: req.body.data[y].product,
        warehouse_id: req.body.warehouse,
        origin: req.body.order_id,
        qout: req.body.data[y].qty_rec,
        uom_id: req.body.data[y].uom_id,
        date: req.body.date,
        company_id: req.body.data[y].company_id,
        cost: req.body.data[y].product_data.productcostcomps[0].cost,
      });
      Stockmove.create(stockmove).then(datad => {
        insertUpdateStock("out", req.body.data[y].product, req.body.partner, req.body.warehouse, req.body.data[y]).then(qop => {
          entriesSM = [];
          entriesSM.push({label: req.body.data[y].product_data.name, debit: req.body.data[y].product_data.productcostcomps[0].cost, 
            debits: p2.outgoings, date: req.body.date});
          entriesSM.push({label: req.body.data[y].product_data.name, credit: req.body.data[y].product_data.productcostcomps[0].cost, 
            credits: p2.inventorys, date: req.body.date});
          const inJournal = {
            date: req.body.date,
            type: "stock",
            origin: tids[0],
            entry: entriesSM,
            amount: req.body.data[y].product_data.productcostcomps[0].cost,
            company: req.body.company,
            user: req.body.user
          };
          inputJournal(inJournal).then(inputJour => {
            sequencingSM(tids, posid, y, req, res);
          }).catch(err =>{console.error("pos0202",err);res.status(500).send({message:err}); });
        }).catch(err =>{console.error("pos0203",err);res.status(500).send({message:err}); });
      }).catch(err =>{console.error("pos0204",err);res.status(500).send({message:err}); });
    }else{
      sequencingSM(tids, posid, y, req, res);
    }
  }).catch(err =>{console.error("pos0205",err);res.status(500).send({message:err}); });
  
}

function sequencingSM(tids, posid, y, req, res) {
  if(req.body.data[y+1]){
    y++;
    stockmoves(tids, posid, y, req, res);
  }else{
    //console.log(prepEntries, prepTax);
    //HAA BINGO TO
    updateTransId(transid[1], transid[2]).then(uti => {
      entries = [];
      prepEnt(0, req, res);
    })
  }
}

function prepEnt(z, req, res) {
  entries.push({
    label: "Income " + prepEntries[z].revenues.code + "-" + prepEntries[z].revenues.name,
    date: req.body.date,
    credit: prepEntries[z].total,
    credits: prepEntries[z].revenues
  })
  entries.push({
    label: "COGS " + prepEntries[z].costs.code + "-" + prepEntries[z].costs.name,
    date: req.body.date,
    debit: prepEntries[z].cost,
    debits: prepEntries[z].costs
  })
  entries.push({
    label: "In Transit " + prepEntries[z].outgoings.code + "-" + prepEntries[z].outgoings.name,
    date: req.body.date,
    credit: prepEntries[z].cost,
    credits: prepEntries[z].outgoings
  })
  seqPrepEnt(z, req, res);
}

function seqPrepEnt(z, req, res) {
  if(prepEntries[z+1]){
    z++;
    prepEnt(z, req, res);
  }else{
    prepTaxEnt(0, req, res);
  }
}

function prepTaxEnt(w, req, res) {
  entries.push({
    label: "Tax " + prepTax[w].taxs.tax + "%",
    date: req.body.date,
    credit: prepTax[w].tax,
    credits: prepTax[w].taxs
  })
  seqPrepTaxEnt(w, req, res);
}

function seqPrepTaxEnt(w, req, res) {
  if(prepTax[w+1]){
    w++;
    prepTaxEnt(w, req, res);
  }else{
    //console.log(entries);
    insertAcc(req, res);
  }
}

function insertAcc(req, res) {
  entries.push({
    label: "Receivable",
    debits: req.body.cross, 
    debit: req.body.amount_total, 
    date: req.body.date
  })
  const insJournal = {
    date: req.body.date,
    type: "pos",
    origin: req.body.order_id,
    entry: entries,
    amount: req.body.amount_total,
    company: req.body.company,
    user: req.body.user,
    partner: req.body.partner,
  };
  inputJournal(insJournal).then(inputJour => {
    res.send({message: "done"});
  }).catch(err =>{console.error("pos0206",err);res.status(500).send({message:err}); }); 
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Pos.find(condition)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'user', model: User })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pos0301",err);res.status(500).send({message:err}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Pos.findById(req.params.id)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'user', model: User })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("pos0401",err);res.status(500).send({message:err}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Pos.find(condition)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'user', model: User })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pos0501",err);res.status(500).send({message:err}); });
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
  Pos.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("pos0601",err);res.status(500).send({message:err}); });
};