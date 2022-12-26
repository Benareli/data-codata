const db = require("../models");
const coa = require("./coa.function");
const id = require("./id.function");
const Id = db.ids;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Log = db.logs;
var result = [];

async function getCoa2(xx, yy) {
  const coa1 = await coa.getCoa2(xx, yy);
  return coa1;
}

async function getUpdateJournalId() {
  const id1 = await id.getUpdateJournalId();
  return id1;
}

function inputJournal(xx, yy, debit, credit, amount, label1, label2, type, date) {
  return new Promise((resolve, reject) => {
	getCoa2(xx, yy).then(coa2 => {
      let oo = coa2[0];
      let pp = coa2[1];
      getUpdateJournalId().then(jids => {
        journid = jids
        const ent1 = ({journal_id: journid, label: label1,
          debit_acc: pp, debit: debit, date: date})
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: label2,
            credit_acc: oo, credit: credit, date: date})
          Entry.create(ent2).then(datab => {
            const journal = ({journal_id: journid, origin: transid, type: type, amount: 
              amount, lock: true,
              entries:[dataa._id, datab._id], date: date})
            Journal.create(journal).then(datad => {
                o=null,p=null,oo=null,pp=null;
                resolve("done");
            }).catch(err =>{console.error("jfunc0101",err.message);reject(err); });
          }).catch(err =>{console.error("jfunc0102",err.message);reject(err); });
        }).catch(err =>{console.error("jfunc0103",err.message);reject(err); });
      }).catch(err =>{console.error("jfunc0104",err.message);reject(err); });
    }).catch(err =>{console.error("jfunc0105",err.message);reject(err); });
  })
}

function inputJournalStock(xx, yy, qt, req, prodname) {
  return new Promise((resolve, reject) => {
  	getCoa2(xx, yy).then(datacoa => {
      let oo = datacoa[0];
      let pp = datacoa[1];
      getUpdateJournalId().then(dataid => {
        journid = dataid;
        const ent1 = ({journal_id: journid, label: prodname,
          debit_acc: oo, debit: qt * (req.cost ? req.cost: 0), date: req.date})
        Entry.create(ent1).then(dataa => {
          const ent2 = ({journal_id: journid, label: prodname,
            credit_acc: pp, credit: qt * (req.cost ? req.cost: 0), date: req.date})
          Entry.create(ent2).then(datab => {
            const journal = ({journal_id: journid, origin: req.trans_id, type: "transfer", lock: true,
              amount: qt * (req.cost ? req.cost: 0), entries:[dataa._id, datab._id], date: req.date})
            Journal.create(journal).then(datac => {
              const log = ({message: "dibuat", journal: datac._id, user: req.user,});
              Log.create(log).then(datad => {
                resolve(dataa);
              }).catch(err =>{console.error("jfunc0201",err.message);reject(err); });
            }).catch(err =>{console.error("jfunc0202",err.message);reject(err); });
          }).catch(err =>{console.error("jfunc0203",err.message);reject(err); });
        }).catch(err =>{console.error("jfunc0204",err.message);reject(err); });
      }).catch(err =>{console.error("jfunc0205",err.message);reject(err); });
    }).catch(err =>{console.error("jfunc0206",err.message);reject(err); });
  })
};

const journal = {
  inputJournal,
  inputJournalStock,
};
module.exports = journal;