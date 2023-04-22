const db = require("../../models");
const { compare } = require('../../function/key.function');
const {id,coa} = require("../../function");
const Pos = db.poss;
const Possession = db.possessions;
const Payment = db.payments;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Id = db.ids;
const Log = db.logs;
var journid, journalid, journalcount, payments, pays1;

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
    pay_method: titleCase(req.body.pay_method),
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
        var stateNew = fj.amountdue-req.body.payment == 0 ? 2 : 1;
        Journal.update({amountdue:fj.amountdue-req.body.payment, state: stateNew},{where:{id:fj.id}}).then(ufj => {
          insertPayOut(req.body, res);
        })
      })
    }
    /*if(req.body.session!="null"){
      const possF = Possession.find({_id:req.body.session})
        .then(posf => {
        const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
          {$push: {payment: dataa._id}}, { useFindAndModify: false })
            .then(datab => {
              if(req.body.type == "in"){
                insertAcc(req.body, res);
              }else{
                  Journal.findOneAndUpdate({journal_id: req.body.order_id}, {$push: {payment: dataa._id}}, { useFindAndModify: false })
                    .then(jou => {
                      if(!jou.payments){
                        pays1 = Number(req.body.payment1);
                      }else{
                        pays1 = jou.payments + Number(req.body.payment1);
                      }
                      Journal.findByIdAndUpdate(jou._id, {payments: pays1}, {useFindAndModify: false})
                        .then(jou1 => {
                          insertPayOut(req.body, res);
                      }).catch(err => {console.error("pay0101",err.message);res.status(500).send({message:err.message}); })
                    }).catch(err => {console.error("pay0102",err.message);res.status(500).send({message:err.message}); })
                }
              }).catch(err => {console.error("pay0103",err.message);res.status(500).send({message:err.message}); })
          }).catch(err => {console.error("pay0104",err.message);res.status(500).send({message:err.message}); })
      }else{
        insertAcc(req.body, res);
      }*/
    }).catch(err => {res.status(500).send({message:err.message}); })
};

function insertPayOut(req, res) {
  getCoaPayout(1, req).then(datacoa => {
    oo = datacoa[0];
    pp = datacoa[1];
    getUpdateJournalId().then(dataid => {
      journid = dataid;
      const journal = ({name: journid, origin: req.pay_id, type: "payment", lock: true,
        amount: req.payment, date: req.date})
      Journal.create(journal).then(dataz => {
        const ent1 = ({label: req.order_id, debit_id: oo, debit: req.payment, date: req.date})
        Entry.create(ent1).then(dataa => {
          const ent2 = ({label: req.pay_method, credit_id: pp, credit: req.payment, date: req.date})
          Entry.create(ent2).then(datab => {
            dataz.addEntrys(dataa);
            dataz.addEntrys(datab);
            Journal.findOne({where:{name:req.order_id}}).then(datay => {
              datay.addPayments(payments);
              const log = ({message: "dibuat", journal: dataz.id, user: req.user,});
                Log.create(log).then(datae => {
                  res.send(payments);
              }).catch(err =>{console.error("pay0201",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("pay0202",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("pay0203",err.message);res.status(500).send({message:err.message}); })
        }).catch(err =>{console.error("pay0204",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("pay0205",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("pay0206",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("pay0207",err.message);res.status(500).send({message:err.message}); });
}

function insertAcc(req, res) {
  getCoaPayment(1, req).then(datacoa => {
    oo = datacoa[0];
    pp = datacoa[1];
    getJournalId1().then(dataid => {
      journid = dataid;
      const ent1 = ({journal_id: journid, label: req.pay1method,
        debit_acc: pp, debit: req.payment1, date: req.date})
      Entry.create(ent1).then(dataa => {
        const ent2 = ({journal_id: journid, label: req.order_id ,
          credit_acc: oo, credit: req.payment1, date: req.date})
        Entry.create(ent2).then(datab => {
          const journal = ({journal_id: journid, origin: req.pay_id, type: "payment", lock: true,
            amount: Number(req.payment1) + Number(req.payment2) ? req.payment2 : 0 + 
              Number(req.change) ? req.change : 0,
            entries:[dataa._id, datab._id], date: req.date})
            Journal.create(journal).then(datac => {
              const log = ({message: "dibuat", journal: datac._id, user: req.user,});
              Log.create(log).then(datae => {
                if(req.payment2>0){
                  secondAcc(req,res);
                }else if(req.change>0){
                  changeAcc(req,res);
                }else{
                  res.send(payments);
                }
              }).catch(err =>{console.error("pay0301",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("pay0302",err.message);res.status(500).send({message:err.message}); })
          }).catch(err =>{console.error("pay0303",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("pay0304",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("pay0305",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("pay0306",err.message);res.status(500).send({message:err.message}); });
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