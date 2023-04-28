const db = require("../../models");
const { compare } = require('../../function/key.function');
const {id,coa,journal} = require("../../function");
const { getCoa2 } = require("../../function/coa.function");
const Pos = db.poss;
const Possession = db.possessions;
const Payment = db.payments;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Id = db.ids;
const Log = db.logs;
var journid, journalid, journalcount, payments, pays1, entries = [];

async function getJournalId1() {
  const res1 = await id.getJournalId1();
  return res1;
}

async function getCoaPayment(x, req) {
  const res2 = await coa.getCoaPayment(x, req);
  return res2;
}

async function getUpdateJournalId() {
  const res3 = await id.getUpdateJournalId();
  return res3;
}

async function getCoaPayout(x, req) {
  const res4 = await coa.getCoaPayout(x, req);
  return res4;
}

async function inputJournal(data) {
  const res5 = await journal.inputJournal(data);
  return res5;
}

exports.create = (req, res) => {
  pays1 = 0;
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if(req.body.type == "in"){
    req.body.type = 0;
  }else if(req.body.type == "out"){
    req.body.type = 1;
  }
  const payment = ({
    pay_id: req.body.pay_id,
    order_id: req.body.order_id,
    amount_total: req.body.amount_total,
    payment: Number(req.body.payment),
    pay_method: titleCase(req.body.pay_method.name),
    pay_note: req.body.pay_note,
    change: req.body.change,
    change_method: req.body.change_method,
    date: req.body.date,
    type: req.body.type,
  });
  Payment.create(payment).then(dataa => {
    payments = dataa;
    if(req.body.type == 1){
      Journal.findOne({where:{name:req.body.order_id}}).then(fj => {
        fj.addPayment(dataa);
        var stateNew = fj.amountdue-req.body.payment == 0 ? 2 : 1;
        Journal.update({amountdue:fj.amountdue-req.body.payment, state: stateNew},{where:{id:fj.id}}).then(ufj => {
          insertJournal(req, res); 
        })
      })
    }
  }).catch(err => {res.status(500).send({message:err.message}); })
};

function insertJournal(req, res){
  entries = [];
  entries.push({
    label: req.body.order_id,
    debits: req.body.cross, 
    debit: Number(req.body.payment), 
    date: req.body.date,
  })
  entries.push({
    label: req.body.pay_method.name,
    credits: req.body.pay_method.coas, 
    credit: Number(req.body.payment), 
    date: req.body.date,
  })
  const insJournal = {
    date: req.body.date,
    type: "payment",
    origin: req.body.pay_id,
    entry: entries,
    amount: Number(req.body.payment),
    company: req.body.company,
    user: req.body.user,
    partner: req.body.partner,
  };
  if(entries.length >= 2){
    inputJournal(insJournal).then(inputJour => {
      res.send(inputJour);
    }).catch(err =>{console.error("pay0201",err.message);res.status(500).send({message:err.message}); });
  }
}

function secondAcc(req, res) {
  getCoaPayment(2, req).then(datacoa => {
    oo = datacoa[0];
    pp = datacoa[1];
    const ent1 = ({journal_id: journid, label: req.pay2method,
      debit_acc: pp, debit: req.payment2, date: req.date})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: journid, label: req.order_id ,
        credit_acc: oo, credit: req.payment2, date: req.date})
      Entry.create(ent2).then(datab => {
        Journal.updateOne({journal_id: journid}, 
            {$push: {entries: [dataa._id,datab._id]}})
          .then(datac => {
            if(req.change>0){
              changeAcc(req,res,o,k,b,c);
            }else{
              res.send(payments);
            }
          }).catch(err =>{console.error("pay0401",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("pay0402",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("pay0403",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("pay0404",err.message);res.status(500).send({message:err.message}); });
}

function changeAcc(req, res) {
  getCoaPayment(3, req).then(datacoa => {
    oo = datacoa[0];
    pp = datacoa[1];
    const ent1 = ({journal_id: journid, label: "Change",
      debit_acc: oo, debit: req.change, date: req.date})
    Entry.create(ent1).then(dataa => {
      const ent2 = ({journal_id: journid, label: req.order_id ,
        credit_acc: pp, credit: req.change, date: req.date})
      Entry.create(ent2).then(datab => {
        Journal.updateOne({journal_id: journid}, 
            {$push: {entries: [dataa._id,datab._id]}})
          .then(datac => {
            res.send(payments);
          }).catch(err =>{console.error("pay0401",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("pay0402",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("pay0403",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("pay0404",err.message);res.status(500).send({message:err.message}); });
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Payment.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pay0501",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Payment.findById(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("pay0601",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const order_id = req.query.order_id;
  var condition = order_id ? { order_id: { $regex: new RegExp(order_id), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Payment.find(condition)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pay0701",err.message);res.status(500).send({message:err.message}); });
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
  Payment.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("pay0801",err.message);res.status(500).send({message:err.message}); });
};

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}