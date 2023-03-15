const db = require("../models");
const coa = require("./coa.function");
const id = require("./id.function");
const Id = db.ids;
const Coa = db.coas;
const Journal = db.journals;
const Entry = db.entrys;
const Log = db.logs;
var result = [];
var l = 0;
var entries = [];

async function getCoa(coa) {
  const coa1 = await coa.getCoa(coa);
  return coa1;
}

async function getCoa2(xx, yy) {
  const coa2 = await coa.getCoa2(xx, yy);
  return coa2;
}

async function getUpdateJournalId() {
  const id1 = await id.getUpdateJournalId();
  return id1;
}

async function getUpdateBillId() {
  const id2 = await id.getUpdateBillId();
  return id2;
}

async function getUpdateInvoiceId() {
  const id3 = await id.getUpdateInvoiceId();
  return id3;
}

function inputJournal(data) {
  return new Promise((resolve, reject) => {
    //console.log("Journal", data);
    const getIdFunction = {
      'miscellaneous': getUpdateJournalId,
      'stock': getUpdateJournalId,
      'bill': getUpdateBillId,
      'invoice': getUpdateInvoiceId
    };
    if (data.type in getIdFunction) {
      getIdFunction[data.type]()
        .then(id => inJournal(data, id))
          .then(() => resolve('done'))
          .catch(err => {console.error('jfunc0001', err.message); reject(err); });
    } else {
      reject(new Error(`Invalid data type: ${data.type}`));
    }
  });
}

function inJournal(data, journid) {
  entries = [];
  const journal = {
    name: journid,
    type: data.type,
    origin: data.origin,
    amount: data.amount,
    ...((data.type=="bill" || data.type=="invoice") ? {amountdue: data.amount} : {}),
    ...((data.type=="bill" || data.type=="invoice") ? {state: 0} : {}),
    ...((data.type=="bill" || data.type=="invoice") ? {partner_id: data.partner} : {}),
    lock: false,
    date: data.date,
    company_id: data.company,
  };
  Journal.create(journal).then(inJour => {
    inEntry(data, inJour);
  });
}

function inEntry(data, inJour) {
  const entryData = data.entry[l];
  const ent = {
    journal_id: inJour.id,
    label: entryData.label,
    date: data.date,
    ...(entryData.debit ? {debit_id: entryData.debits.id,debit: entryData.debit} : {}),
    ...(entryData.credit ? {credit_id: entryData.credits.id, credit: entryData.credit} : {}),
    ...(entryData.product_id ? {product_id: entryData.product_id} : {}),
    ...(entryData.qty ? {qty: entryData.qty} : {}),
    ...(entryData.price_unit ? {price_unit: entryData.price_unit} : {}),
    ...(entryData.tax ? {tax: entryData.tax} : {}),
    ...(entryData.discount ? {tax: entryData.discount} : {}),
    ...(entryData.subtotal ? {tax: entryData.subtotal} : {}),
  };
  //console.log(inJour.id);
  Entry.create(ent).then(ents => {
    entries.push(ents);
    checker(data, inJour);
  });
}

function checker(data, inJour) {
  if (data.entry[l + 1]) {
    l++;
    inEntry(data, inJour);
  } else {
    l = 0;
    const log = ({message: "dibuat", journal: inJour.id, user: data.user,});
    Log.create(log).then(datae => {
      entries.forEach(entry => inJour.addEntrys(entry));
      return Promise.resolve();
    }).catch(err => {console.error('jfunc0002', err.message); reject(err); });
  }
}

const journal = {
  inputJournal,
};
module.exports = journal;