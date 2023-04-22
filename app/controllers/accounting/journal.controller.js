const db = require("../../models");
const { compare } = require('../../function/key.function');
const {id,coa,journal} = require("../../function");
const Journal = db.journals;
const Journal_type = db.journal_type;
const Entry = db.entrys;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
const Company = db.companys;
const Log = db.logs;
const Payment = db.payments;
const Partner = db.partners;
const Product = db.products;
const Uom = db.uoms;
const ProductCatAcc = db.productcataccs;
const Purchasedetail = db.purchasedetails;
const Saledetail = db.saledetails;
var billids, taxes, subtotal, entries = [], jnl;

async function getUpdateBillId() {
  const res1 = await id.getUpdateBillId();
  return res1;
}

async function getCoa(coa1) {
  const res2 = await coa.getCoa2(coa1);
  return res2;
}

async function getCoa2(coa1, coa2) {
  const res2 = await coa.getCoa2(coa1, coa2);
  return res2;
}

async function getCoa3(coa1, coa2, coa3) {
  const res3 = await coa.getCoa3(coa1, coa2, coa3);
  return res3;
}

async function getUpdateInvId() {
  const res4 = await id.getUpdateInvId();
  return res4;
}

async function inputJournal(data) {
  const res5 = await journal.inputJournal(data);
  return res5;
}

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  inputJournal(req.body)
    .then(data => {
      if(data == 'done') res.send({message:data});
    }).catch(err =>{console.error("jour0001",err.message);res.status(500).send({message:err.message}); });
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findAll({include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}],
        attributes: ["id", "label", "debit", "credit"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("jour0101",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findByPk(req.params.id, {include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}, {model: Uom, as: "uoms"}
        , {model: Product, as: "products"}],
        attributes: ["id", "label", "debit", "credit", "qty", "price_unit", "discount", "tax", "subtotal"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Payment, as: "payments", through: {attributes: ["payment_id", "journal_id"]}},
      {model: Partner, as: "partners"}, {model: Company, as: "companys"}
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findJourType = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  res.send(Journal_type);
};

exports.findJournal = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findAll({where:{type: { $nin: ["bill","invoice"] }}, include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}
        , {model: Product, as: "products"}],
        attributes: ["id", "label", "debit", "credit"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour2101",err.message);res.status(500).send({message:err.message}); });
};

exports.findJourn = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findOne({where:{journal_id: req.params.journal}, include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}
        , {model: Product, as: "products"}],
        attributes: ["id", "label", "debit", "credit"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour2201",err.message);res.status(500).send({message:err.message}); });
};

exports.findOrigin = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findAll({where:{origin: req.params.origin}, include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}],
        attributes: ["id", "label", "debit", "credit"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour2301",err.message);res.status(500).send({message:err.message}); });
};

exports.findBill = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findAll({where:{type: "bill"}, include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}],
        attributes: ["id", "label", "debit", "credit"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour2401",err.message);res.status(500).send({message:err.message}); });
};

// Create and Save new
exports.createBill = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.origin) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  
  taxes = 0;
  entries = [];
  if(req.body.productbill.length > 1){
    playSequencing(0, req, res);
  }else{
    getCoa2("2-1001", "1-2901").then(datacoa => {
      let oo = datacoa[0];
      let pp = datacoa[1];
      Product.findByPk(req.body.productbill[0]).then(p1 => {
        ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body.company}, include: [
          {model: Coa, as: "incomings"},
          {model: Coa, as: "inventorys"},
        ], raw: true, nest: true}).then(p2 => {
          if(req.body.tax[0] > 0){
            entries.push({
              label: "Tax " + req.body.tax[0] + "%",
              debits: pp.dataValues, 
              debit: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
              date: req.body.date
            });
          }
          entries.push({
            label: p1.name,
            product_id: req.body.productbill[0],
            date: req.body.date,
            debit: (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0])),
            debits: p2.incomings,
            qty: req.body.qrec[0],
            uom_id: req.body.uom[0],
            price_unit: req.body.priceunit[0],
            tax: req.body.tax[0],
            discount: req.body.discount[0],
            subtotal: req.body.subtotal[0]
          });
          entries.push({
            label: "Payable",
            credits: oo.dataValues, 
            credit: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
              ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
            date: req.body.date
          })
          const insJournal = {
            date: req.body.date,
            duedate: req.body.duedate,
            type: "bill",
            origin: req.body.origin,
            entry: entries,
            amount: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
              ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))),
            company: req.body.company,
            user: req.body.user,
            partner: req.body.partner,
          };
          if(entries.length >= 2){
            inputJournal(insJournal).then(inputJour => {
              Purchasedetail.findByPk(req.body.pdetail[0]).then(pdet1 => {
                Purchasedetail.update({qty_inv:(pdet1.qty_inv+req.body.qrec[0])},{where:{id:req.body.pdetail[0]}}).then(pdet2 => {
                  res.send({message: "done"});
                })
              })
            }).catch(err =>{console.error("sracc0103",err.message);res.status(500).send({message:err.message}); });
          }else{
            //insertAcc(x, alldata, res, type, data, cost);
          }
        }).catch(err =>{console.error("sracc0101",err.message); });
      }).catch(err =>{console.error("sracc0102",err.message); });
    }).catch(err =>{console.error("sracc0103",err.message); });
  }
};

function playSequencing(x, req, res){
  if(req.body.productbill[x]){
    if(x == 0){
      getCoa2("2-1001", "1-2901").then(datacoa => {
        let oo = datacoa[0];
        let pp = datacoa[1];
        Product.findByPk(req.body.productbill[x]).then(p1 => {
          ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body.company}, include: [
            {model: Coa, as: "incomings"},
            {model: Coa, as: "inventorys"},
          ], raw: true, nest: true}).then(p2 => {
            if(req.body.tax[x] > 0){
              entries.push({
                label: "Tax " + req.body.tax[x] + "%",
                debits: pp.dataValues, 
                debit: (req.body.tax[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))), 
                date: req.body.date
              });
            }
            entries.push({
              label: p1.name,
              product_id: req.body.productbill[x],
              date: req.body.date,
              debit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])),
              debits: p2.incomings,
              qty: req.body.qrec[x],
              uom_id: req.body.uom[x],
              price_unit: req.body.priceunit[x],
              tax: req.body.tax[x],
              discount: req.body.discount[x],
              subtotal: req.body.subtotal[x]
            });
            entries.push({
              label: "Payable",
              credits: oo.dataValues, 
              credit: (req.body.tax[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))) +
                ((req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))), 
              date: req.body.date
            })
            sequencing(x, req, res);
          }).catch(err =>{console.error("sracc0201",err.message); });
        }).catch(err =>{console.error("sracc0202",err.message); });
      }).catch(err =>{console.error("sracc0203",err.message); });
    }else{
      Product.findByPk(req.body.productbill[x]).then(p1 => {
          ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body.company}, include: [
            {model: Coa, as: "incomings"},
            {model: Coa, as: "inventorys"},
          ], raw: true, nest: true}).then(p2 => {
            entries.push({
              label: p1.name,
              product_id: req.body.productbill[x],
              date: req.body.date,
              debit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])),
              debits: p2.incomings,
              qty: req.body.qrec[x],
              uom_id: req.body.uom[x],
              price_unit: req.body.priceunit[x],
              tax: req.body.tax[x],
              discount: req.body.discount[x],
              subtotal: req.body.subtotal[x]
            });
            sequencing(x, req, res);
        }).catch(err =>{console.error("sracc0203",err.message); });
      }).catch(err =>{console.error("sracc0204",err.message); });
    }
  }else{
    const insJournal = {
      date: req.body.date,
      duedate: req.body.duedate,
      type: "bill",
      origin: req.body.origin,
      entry: entries,
      amount: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
        ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))),
      company: req.body.company,
      user: req.body.user,
      partner: req.body.partner,
    };
    if(entries.length >= 2){
      inputJournal(insJournal).then(inputJour => {
        Purchasedetail.findByPk(req.body.pdetail[0]).then(pdet1 => {
          Purchasedetail.update({qty_inv:(pdet1.qty_inv+req.body.qrec[0])},{where:{id:req.body.pdetail[0]}}).then(pdet2 => {
            res.send({message: "done"});
          })
        })
      }).catch(err =>{console.error("sracc0103",err.message);res.status(500).send({message:err.message}); });
    }else{
      //insertAcc(x, alldata, res, type, data, cost);
    }
  } 
}

function sequencing(x, req, res){
  x=x+1;
  playSequencing(x, req, res);
}

// Update by the id in the request
exports.updateLock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }

  Journal.update({lock: req.body.lock}, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
      } else{
        const log = ({message: "updated", journal: data.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("jour2501",err.message);res.status(500).send({message:err.message}); });
      } 
    }).catch(err =>{console.error("jour2601",err.message);res.status(500).send({message:err.message}); });   
};

// Find a single with an id
exports.findInv = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Journal.findAll({where:{type: "invoice"}, include: [
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}],
        attributes: ["id", "label", "debit", "credit"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour2701",err.message);res.status(500).send({message:err.message}); });
};

// Create and Save new
exports.createInv = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.origin) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  taxes = 0;
  entries = [];
  if(req.body.productbill.length > 1){
    playSequencingInv(0, req, res);
  }else{
    getCoa2("1-2001", "2-4001").then(datacoa => {
      let oo = datacoa[0];
      let pp = datacoa[1];
      Product.findByPk(req.body.productbill[0]).then(p1 => {
        ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body.company}, include: [
          {model: Coa, as: "inventorys"},
          {model: Coa, as: "outgoings"},
          {model: Coa, as: "revenues"},
        ], raw: true, nest: true}).then(p2 => {
          if(req.body.tax[0] > 0){
            entries.push({
              label: "Tax " + req.body.tax[0] + "%",
              credits: pp.dataValues, 
              credit: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
              date: req.body.date
            });
          }
          entries.push({
            label: p1.name,
            product_id: req.body.productbill[0],
            date: req.body.date,
            credit: (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0])),
            credits: p2.revenues,
            qty: req.body.qrec[0],
            uom_id: req.body.uom[0],
            price_unit: req.body.priceunit[0],
            tax: req.body.tax[0],
            discount: req.body.discount[0],
            subtotal: req.body.subtotal[0]
          });
          entries.push({
            label: "Receivable",
            debits: oo.dataValues, 
            debit: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
              ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
            date: req.body.date
          })
          const insJournal = {
            date: req.body.date,
            duedate: req.body.duedate,
            type: "invoice",
            origin: req.body.origin,
            entry: entries,
            amount: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
              ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))),
            company: req.body.company,
            user: req.body.user,
            partner: req.body.partner,
          };
          if(entries.length >= 2){
            inputJournal(insJournal).then(inputJour => {
              Saledetail.findByPk(req.body.pdetail[0]).then(pdet1 => {
                Saledetail.update({qty_inv:(pdet1.qty_inv+req.body.qrec[0])},{where:{id:req.body.pdetail[0]}}).then(pdet2 => {
                  res.send({message: "done"});
                })
              })
            }).catch(err =>{console.error("inv0101",err.message);res.status(500).send({message:err.message}); });
          }else{
            //insertAcc(x, alldata, res, type, data, cost);
          }
        }).catch(err =>{console.error("inv0102",err.message); });
      }).catch(err =>{console.error("inv0103",err.message); });
    }).catch(err =>{console.error("inv0104",err.message); });
  }
};

function playSequencingInv(x, req, res){
  if(req.body.productbill[x]){
    if(x == 0){
      getCoa2("1-2001", "2-4001").then(datacoa => {
        let oo = datacoa[0];
        let pp = datacoa[1];
        Product.findByPk(req.body.productbill[x]).then(p1 => {
          ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body.company}, include: [
            {model: Coa, as: "inventorys"},
            {model: Coa, as: "outgoings"},
            {model: Coa, as: "revenues"},
          ], raw: true, nest: true}).then(p2 => {
            if(req.body.tax[x] > 0){
              entries.push({
                label: "Tax " + req.body.tax[x] + "%",
                credits: pp.dataValues, 
                credit: (req.body.tax[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))), 
                date: req.body.date
              });
            }
            entries.push({
              label: p1.name,
              product_id: req.body.productbill[x],
              date: req.body.date,
              credit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])),
              credits: p2.revenues,
              qty: req.body.qrec[x],
              uom_id: req.body.uom[x],
              price_unit: req.body.priceunit[x],
              tax: req.body.tax[x],
              discount: req.body.discount[x],
              subtotal: req.body.subtotal[x]
            });
            entries.push({
              label: "Receivable",
              debits: oo.dataValues, 
              debit: (req.body.tax[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))) +
                ((req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))), 
              date: req.body.date
            })
            sequencing(x, req, res);
          }).catch(err =>{console.error("inv0105",err.message); });
        }).catch(err =>{console.error("inv0106",err.message); });
      }).catch(err =>{console.error("inv0107",err.message); });
    }else{
      Product.findByPk(req.body.productbill[x]).then(p1 => {
          ProductCatAcc.findOne({where:{category_id: p1.productcat_id, company_id: req.body.company}, include: [
            {model: Coa, as: "inventorys"},
            {model: Coa, as: "outgoings"},
            {model: Coa, as: "revenues"},
          ], raw: true, nest: true}).then(p2 => {
            entries.push({
              label: p1.name,
              product_id: req.body.productbill[x],
              date: req.body.date,
              credit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])),
              credits: p2.revenues,
              qty: req.body.qrec[x],
              uom_id: req.body.uom[x],
              price_unit: req.body.priceunit[x],
              tax: req.body.tax[x],
              discount: req.body.discount[x],
              subtotal: req.body.subtotal[x]
            });
            sequencing(x, req, res);
        }).catch(err =>{console.error("inv0108",err.message); });
      }).catch(err =>{console.error("inv0109",err.message); });
    }
  }else{
    const insJournal = {
      date: req.body.date,
      duedate: req.body.duedate,
      type: "invoice",
      origin: req.body.origin,
      entry: entries,
      amount: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
        ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))),
      company: req.body.company,
      user: req.body.user,
      partner: req.body.partner,
    };
    if(entries.length >= 2){
      inputJournal(insJournal).then(inputJour => {
        Saledetail.findByPk(req.body.pdetail[0]).then(pdet1 => {
          Saledetail.update({qty_inv:(pdet1.qty_inv+req.body.qrec[0])},{where:{id:req.body.pdetail[0]}}).then(pdet2 => {
            res.send({message: "done"});
          })
        })
      }).catch(err =>{console.error("inv0110",err.message);res.status(500).send({message:err.message}); });
    }else{
      //insertAcc(x, alldata, res, type, data, cost);
    }
  }
}

function sequencingInv(x, req, res){
  x=x+1;
  playSequencingInv(x, req, res);
}

