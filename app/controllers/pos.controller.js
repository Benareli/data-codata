const db = require("../models");
const {id,coa} = require("../function");
const { compare } = require('../function/key.function');
const Pos = db.poss;
const Posdetail = db.posdetails;
const Possession = db.possessions;
const Brand = db.brands;
const Partner = db.partners;
const Log = db.logs;
const User = db.users;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Id = db.ids;
var journid, journalid, journalcount;

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

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.order_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  if(req.body.partner != "null"){
    const pos = ({
      order_id: req.body.order_id,
      date: req.body.date,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_subtotal: req.body.amount_subtotal,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      partner: req.body.partner,
      user: req.body.user,
      open: req.body.open,
      store: req.body.store,
      payment: [req.body.payment]
    });
    Pos.create(pos).then(dataa => { 
      if(req.body.session!="null"){
        const possF = Possession.find({_id:req.body.session})
          .then(posf => {
          const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
            {$push: {pos: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                insertAcc(req.body, res);
                //res.send(datab);
              }).catch(err =>{console.error("pos0101",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("pos0102",err.message);res.status(500).send({message:err.message}); });
      }else{
        insertAcc(req.body, res);
        //res.send(dataa);
      }
    });
  }
  else if(req.body.partner == "null"){
    const pos = ({
      order_id: req.body.order_id,
      date: req.body.date,
      disc_type: req.body.disc_type,
      discount: req.body.discount,
      amount_subtotal: req.body.amount_subtotal,
      amount_untaxed: req.body.amount_untaxed,
      amount_tax: req.body.amount_tax,
      amount_total: req.body.amount_total,
      user: req.body.user,
      open: req.body.open,
      store: req.body.store,
      payment: [req.body.payment]
    });
    Pos.create(pos).then(dataa => {
      if(req.body.session!="null"){
        const possF = Possession.find({_id:req.body.session})
          .then(posf => {
          const poss1 = Possession.findOneAndUpdate({_id:req.body.session}, 
            {$push: {pos: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                insertAcc(req.body, res);
                //res.send(datab);
              }).catch(err =>{console.error("pos0103",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("pos0104",err.message);res.status(500).send({message:err.message}); });
      }else{
        insertAcc(req.body, res);
        //res.send(dataa);
      }
    });
  }
};

function insertAcc(req, res) {
  getCoaPos().then(datacoa => {
    let oo = datacoa[0];
    let pp = datacoa[1];
    let qq = datacoa[2];
    getJournalId().then(dataid => {
      journid = dataid[0];
      const ent1 = ({journal_id: journid, label: req.order_id,
        debit_acc: pp, debit: req.amount_total, date: req.date})
      updateJournalId2(dataid[1], dataid[2])
        .then(datae => {
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: "Income + "+req.order_id,
            credit_acc: oo, credit: req.amount_untaxed, date: req.date})
          Entry.create(ent2).then(datab => {
            const ent3 = ({journal_id: journid , label: "Tax",
              credit_acc: qq, credit: req.amount_tax, date: req.date})
            Entry.create(ent3).then(datac => {
              if(req.amount_tax>0){
                const journal = ({journal_id: journid, origin: req.order_id, amount: req.amount_total, lock: true,
                  type: "pos", entries:[dataa._id, datab._id, datac._id], date: req.date})
                Journal.create(journal).then(datad => {
                  const log = ({message: "dibuat", journal: datad._id, user: req.user,});
                  Log.create(log).then(datae => {
                    res.send(datad);
                  }).catch(err =>{console.error("pos0201",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("pos0202",err.message);res.status(500).send({message:err.message}); });
              }else{
                const journal = ({journal_id: journid, origin: req.order_id, amount: req.amount_total,
                  type: "pos", entries:[dataa._id, datab._id], date: req.date})
                Journal.create(journal).then(datad => {
                  const log = ({message: "dibuat", journal: datad._id, user: req.user,});
                  Log.create(log).then(datae => {
                    res.send(datad);
                  }).catch(err =>{console.error("pos0203",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("pos0204",err.message);res.status(500).send({message:err.message}); });
              }
            }).catch(err =>{console.error("pos0205",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("pos0206",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("pos0207",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("pos0208",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("pos0209",err.message);res.status(500).send({message:err.message}); });
  }).catch(err =>{console.error("pos0210",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("pos0301",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("pos0401",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("pos0501",err.message);res.status(500).send({message:err.message}); });
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
    }).catch(err =>{console.error("pos0601",err.message);res.status(500).send({message:err.message}); });
};