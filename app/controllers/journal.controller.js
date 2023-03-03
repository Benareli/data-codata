const db = require("../models");
const { compare } = require('../function/key.function');
const {id,coa} = require("../function");
const Journal = db.journals;
const Entry = db.entrys;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
const Log = db.logs;
const Payment = db.payments;
const Partner = db.partners;
const Product = db.products;
const Purchasedetail = db.purchasedetails;
const Saledetail = db.saledetails;
var billids, taxes, subtotal, entries = [], jnl;

async function getUpdateBillId() {
  const res1 = await id.getUpdateBillId();
  return res1;
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
      {model: Entry, as: "entrys", include: [{model: Coa, as: "debits"}, {model: Coa, as: "credits"}
        , {model: Product, as: "products"}],
        attributes: ["id", "label", "debit", "credit", "qty", "price_unit", "discount", "tax", "subtotal"],
        through: {attributes: ["entry_id", "journal_id"]}
      },
      {model: Payment, as: "payments", through: {attributes: ["payment_id", "journal_id"]}},
      {model: Partner, as: "partners"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("jour0201",err.message);res.status(500).send({message:err.message}); });
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
  if(req.body.productbill.length > 1){
    playSequencing(0, req, res);
  }else{
    xx = "2-1001"; yy = "1-3901"; zz = "1-2901";
    getCoa3(xx, yy, zz).then(datacoa => {
      let oo = datacoa[0];
      let pp = datacoa[1];
      let qq = datacoa[2];
      getUpdateBillId().then(dataid => {
        billid = dataid;
        const journal = ({name: billid, origin: req.body.origin, type: "bill", state: 0, partner_id: req.body.partner, lock: false,
          amount: req.body.amount, amountdue: req.body.amount, date: req.body.date, duedate: req.body.duedate})
        Journal.create(journal).then(dataz => {
          const ent1 = ({label: req.body.productname[0], product_id: req.body.productbill[0], tax: req.body.tax[0], discount: req.body.discount[0],
            debit_id: pp, debit: (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0])), 
            date: req.body.date, qty: req.body.qrec[0], price_unit: req.body.priceunit[0], subtotal: req.body.subtotal[0]})
          Entry.create(ent1).then(dataa => {
            Purchasedetail.update({qty_inv: req.body.qinv[0] + req.body.qrec[0]}, {where: {id:req.body.pdetail[0]}})
              .then(dataf => {
                if(req.body.tax[0] > 0){
                  const ent2 = ({label: "Tax " + req.body.tax[0] + "%",
                    debit_id: qq, debit: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
                    date: req.body.date})
                  Entry.create(ent2).then(datab => {
                    const ent3 = ({label: "Payable",
                      credit_id: oo, credit: (req.body.tax[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))) +
                      ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
                      date: req.body.date}) 
                    Entry.create(ent3).then(datac => {
                      xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
                      dataz.addEntrys(dataa);
                      dataz.addEntrys(datab);
                      dataz.addEntrys(datac);
                      const log = ({message: "dibuat", journal: datac._id, user: req.user,});
                      Log.create(log).then(datae => {
                        res.send(dataa);
                      }).catch(err =>{console.error("bill0101",err.message);res.status(500).send({message:err.message}); });
                    }).catch(err =>{console.error("bill0102",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("bill0103",err.message);res.status(500).send({message:err.message}); });
                }else{
                const ent3 = ({label: "Payable",
                  credit_id: oo, credit: ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0]))), 
                  date: req.body.date}) 
                Entry.create(ent3).then(datac => {
                  xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
                  dataz.addEntrys(dataa);
                  dataz.addEntrys(datac);
                  const log = ({message: "dibuat", journal: dataz.id, user: req.user,});
                  Log.create(log).then(datae => {
                    res.send(dataa);
                  }).catch(err =>{console.error("bill0104",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("bill0105",err.message);res.status(500).send({message:err.message}); });
              }
            }).catch(err =>{console.error("bill0106",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("bill0107",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("bill0108",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("bill0109",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("bill0110",err.message);res.status(500).send({message:err.message}); });
  }
};

function playSequencing(x, req, res){
  xx = "2-1001"; yy = "1-3901"; zz = "1-2901";
  getCoa3(xx, yy, zz).then(datacoa => {
    let oo = datacoa[0];
    let pp = datacoa[1];
    let qq = datacoa[2];
    if(req.body.productbill[x]){
      if(x == 0){
        getUpdateBillId().then(dataid => {
          billids = dataid;
          const journal = ({name: billids, origin: req.body.origin, type: "bill", state: 0, partner_id: req.body.partner, lock: false,
            amount: req.body.amount, date: req.body.date, duedate: req.body.duedate})
          Journal.create(journal).then(dataz => {
            jnl = dataz;
            const ent1 = ({label: req.body.productname[x], product_id: req.body.productbill[x], tax: req.body.tax[x], discount: req.body.discount[x],
              debit_id: pp, debit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])), 
              date: req.body.date, qty: req.body.qrec[x], price_unit: req.body.priceunit[x], subtotal: req.body.subtotal[x]})
            Entry.create(ent1).then(dataa => {
              Purchasedetail.update({qty_inv: req.body.qinv[x] + req.body.qrec[x]}, {where:{id:req.body.pdetail[x]}})
                .then(dataf => {
                  taxes = taxes + (req.body.tax[x]/100 * ((req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))));
                  entries.push(dataa);
                  sequencing(x, req, res);
              }).catch(err =>{console.error("bill0201",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("bill0202",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("bill0203",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("bill0204",err.message);res.status(500).send({message:err.message}); });
      }else{
        const ent1 = ({label: req.body.productname[x], product_id: req.body.productbill[x], tax: req.body.tax[x], discount: req.body.discount[x],
          debit_id: pp, debit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])), 
          date: req.body.date, qty: req.body.qrec[x], price_unit: req.body.priceunit[x], subtotal: req.body.subtotal[x]})
        Entry.create(ent1).then(dataa => {
          Purchasedetail.update({qty_inv: req.body.qinv[x] + req.body.qrec[x]}, {where:{id: req.body.pdetail[x]}})
            .then(dataf => {
              taxes = taxes + (req.body.tax[x]/100 * ((req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))));
              entries.push(dataa);
              sequencing(x, req, res);
          }).catch(err =>{console.error("bill0205",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("bill0206",err.message);res.status(500).send({message:err.message}); });
      }
    }else{
      if(taxes>0){
        const ent2 = ({label: "Tax", debit_id: qq, debit: taxes, date: req.body.date})
        Entry.create(ent2).then(datab => {
          entries.push(datab);
          const ent3 = ({label: "Payable", credit_id: oo, credit: req.body.amount ,date: req.body.date}) 
          Entry.create(ent3).then(datac => {
            entries.push(datac);
            xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
            const log = ({message: "dibuat", journal: jnl.id, user: req.user,});
            Log.create(log).then(datad => {
              for(let x=0;x<entries.length;x++){
                jnl.addEntrys(entries[x]);
                if(x == entries.length-1){
                  entries=[];
                  res.send(datad);
                }
              }
            }).catch(err =>{console.error("bill0207",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("bill0208",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("bill0209",err.message);res.status(500).send({message:err.message}); });
      }else{
        const ent3 = ({label: "Payable", credit_id: oo, credit: req.body.amount, date: req.body.date}) 
        Entry.create(ent3).then(datac => {
          entries.push(datac);
          xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
          const log = ({message: "dibuat", journal: jnl.id, user: req.user,});
          Log.create(log).then(datad => {
            for(let x=0;x<entries.length;x++){
              jnl.addEntrys(entries[x]);
              if(x == entries.length-1){
                entries=[];
                res.send(datad);
              }
            }
          }).catch(err =>{console.error("bill0210",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("bill0211",err.message);res.status(500).send({message:err.message}); });
      }
    }
  }).catch(err =>{console.error("bill0212",err.message);res.status(500).send({message:err.message}); });
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
  if(req.body.productinv.length > 1){
    playSequencingInv(0, req, res);
  }else{
    xx = "4-1001"; yy = "1-2001"; zz = "2-4001";
    getCoa3(xx, yy, zz).then(datacoa => {
      let oo = datacoa[0];
      let pp = datacoa[1];
      let qq = datacoa[2];
      getUpdateInvId().then(dataid => {
        invid = dataid;
        const ent1 = ({journal_id: invid, label: req.body.productname[0], product: req.body.sdetail[0], tax: req.body.tax[0], discount: req.body.discount[0],
          credit_acc: oo, credit: (req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0])), 
          date: req.body.date, qty: req.body.qrec[0], price_unit: req.body.priceunit[0], subtotal: req.body.subtotal[0]})
        Entry.create(ent1).then(dataa => {
          Saledetail.findOneAndUpdate({_id: req.body.sdetail[0]}, {qty_inv: req.body.qinv[0] + req.body.qrec[0]}, {useFindAndModify: false})
            .then(dataf => {
              if(req.body.tax[0] > 0){
                const ent2 = ({journal_id: invid, label: "Tax " + req.body.tax[0] + "%",
                  credit_acc: qq, credit: (req.body.tax[0]/100 * ((req.body.qrec[0] * req.body.priceunit[0]) - (req.body.discount[0]/100 * (req.body.qrec[0] * req.body.priceunit[0])))), 
                  date: req.body.date})
                Entry.create(ent2).then(datab => {
                  const ent3 = ({journal_id: invid, label: "Receivable", debit_acc: oo, debit: req.body.amount,  date: req.body.date}) 
                  Entry.create(ent3).then(datac => {
                    const journal = ({journal_id: invid, origin: req.body.origin, type: "invoice", state: 0, partner: req.body.partner, lock: false,
                      amount: req.body.amount, entries:[dataa._id, datab._id, datac._id], date: req.body.date, duedate: req.body.duedate})
                    Journal.create(journal).then(datac => {
                      xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
                      const log = ({message: "dibuat", journal: datac._id, user: req.user,});
                      Log.create(log).then(datad => {
                        res.send(dataa);
                      }).catch(err =>{console.error("inv0101",err.message);res.status(500).send({message:err.message}); });
                    }).catch(err =>{console.error("inv0102",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("inv0103",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("inv0104",err.message);res.status(500).send({message:err.message}); });
              }else{
                const ent3 = ({journal_id: invid, label: "Receivable", debit_acc: oo, debit: req.body.amount,  date: req.body.date}) 
                Entry.create(ent3).then(datac => {
                  const journal = ({journal_id: invid, origin: req.body.origin, type: "invoice", state: 0, partner: req.body.partner, lock: false,
                    amount: req.body.amount, entries:[dataa._id, datac._id], date: req.body.date, duedate: req.body.duedate})
                  Journal.create(journal).then(datac => {
                    xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
                    const log = ({message: "dibuat", journal: datac._id, user: req.user,});
                    Log.create(log).then(datad => {
                      res.send(dataa);
                    }).catch(err =>{console.error("inv0105",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("inv0106",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("inv0107",err.message);res.status(500).send({message:err.message}); });
              }
          }).catch(err =>{console.error("inv0108",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("inv0109",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("inv0110",err.message);res.status(500).send({message:err.message}); });
    }).catch(err =>{console.error("inv0111",err.message);res.status(500).send({message:err.message}); });
  }
};

function playSequencingInv(x, req, res){
  xx = "4-1001"; yy = "1-2001"; zz = "2-4001";
  getCoa3(xx, yy, zz).then(datacoa => {
    let oo = datacoa[0];
    let pp = datacoa[1];
    let qq = datacoa[2];
    if(req.body.productinv[x]){
      if(x == 0){
        getUpdateInvId().then(dataid => {
          invids = dataid;
          const ent1 = ({journal_id: invids, label: req.body.productname[x], product: req.body.sdetail[x], tax: req.body.tax[x], discount: req.body.discount[x],
            credit_acc: oo, credit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])), 
            date: req.body.date, qty: req.body.qrec[x], price_unit: req.body.priceunit[x], subtotal: req.body.subtotal[x]})
          Entry.create(ent1).then(dataa => {
            Saledetail.findOneAndUpdate({_id: req.body.sdetail[x]}, {qty_inv: req.body.qinv[x] + req.body.qrec[x]}, {useFindAndModify: false})
              .then(dataf => {
                taxes = taxes + (req.body.tax[x]/100 * ((req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))));
                entries.push(dataa._id);
                sequencingInv(x, req, res);
            }).catch(err =>{console.error("inv0201",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("inv0202",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("inv0203",err.message);res.status(500).send({message:err.message}); });
      }else{
        const ent1 = ({journal_id: invids, label: req.body.productname[x], product: req.body.sdetail[x], tax: req.body.tax[x], discount: req.body.discount[x],
          credit_acc: oo, credit: (req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x])), 
          date: req.body.date, qty: req.body.qrec[x], price_unit: req.body.priceunit[x], subtotal: req.body.subtotal[x]})
        Entry.create(ent1).then(dataa => {
          Saledetail.findOneAndUpdate({_id: req.body.sdetail[x]}, {qty_inv: req.body.qinv[x] + req.body.qrec[x]}, {useFindAndModify: false})
            .then(dataf => {
              taxes = taxes + (req.body.tax[x]/100 * ((req.body.qrec[x] * req.body.priceunit[x]) - (req.body.discount[x]/100 * (req.body.qrec[x] * req.body.priceunit[x]))));
              entries.push(dataa._id);
              sequencingInv(x, req, res);
          }).catch(err =>{console.error("inv0204",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("inv0205",err.message);res.status(500).send({message:err.message}); });
      }
    }else{
      if(taxes>0){
        const ent2 = ({journal_id: invids, label: "Tax",
          credit_acc: qq, credit: taxes, date: req.body.date})
        Entry.create(ent2).then(datab => {
          entries.push(datab._id);
          const ent3 = ({journal_id: invids, label: "Receivable", debit_acc: pp, debit: req.body.amount ,date: req.body.date}) 
          Entry.create(ent3).then(datac => {
            entries.push(datac._id);
            const journal = ({journal_id: invids, origin: req.body.origin, type: "invoice", state: 0, partner: req.body.partner, lock: false,
              amount: req.body.amount, entries:entries, date: req.body.date, duedate: req.body.duedate})
            Journal.create(journal).then(datac => {
              xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
              const log = ({message: "dibuat", journal: datac._id, user: req.user,});
              Log.create(log).then(datad => {
                res.send(datad);
              }).catch(err =>{console.error("inv0206",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("inv0207",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("inv0208",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("inv0209",err.message);res.status(500).send({message:err.message}); });
      }else{
        const ent3 = ({journal_id: invids, label: "Receivable", debit_acc: pp, debit: req.body.amount, date: req.body.date}) 
        Entry.create(ent3).then(datac => {
          entries.push(datac._id);
          const journal = ({journal_id: invids, origin: req.body.origin, type: "invoice", state: 0, partner: req.body.partner, lock: false,
            amount: req.body.amount, entries:entries, date: req.body.date, duedate: req.body.duedate})
          Journal.create(journal).then(datac => {
            xx=null;yy=null;zz=null;oo=null;pp=null;qq=null;
            const log = ({message: "dibuat", journal: datac._id, user: req.user,});
            Log.create(log).then(datad => {
              res.send(datad);
            }).catch(err =>{console.error("inv0210",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("inv0211",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("inv0212",err.message);res.status(500).send({message:err.message}); });
      }
    }
  }).catch(err =>{console.error("inv0213",err.message);res.status(500).send({message:err.message}); });
}

function sequencingInv(x, req, res){
  x=x+1;
  playSequencingInv(x, req, res);
}

