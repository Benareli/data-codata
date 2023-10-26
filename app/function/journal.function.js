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

async function getUpdateJournalId() {
  const id1 = await id.getUpdateJournalId();
  return id1;
}

async function getUpdateBillId() {
  const id2 = await id.getUpdateBillId();
  return id2;
}

async function getUpdateInvId() {
  const id3 = await id.getUpdateInvId();
  return id3;
}

async function inputJournal(data) {
  return new Promise(async (resolve, reject) => {
    const getIdFunction = {
      'miscellaneous': getUpdateJournalId,
      'stock': getUpdateJournalId,
      'payment': getUpdateJournalId,
      'bill': getUpdateBillId,
      'invoice': getUpdateInvId,
      'pos': getUpdateJournalId,
    };
    if (data.type in getIdFunction) {
      try {
        const id = await getIdFunction[data.type]();
        await inJournal(data, id);
        resolve('done');
      } catch (err) {
        console.error('jfunc0001', err);
        reject(err);
      }
    } else {
      reject(new Error(`Invalid data type: ${data.type}`));
    }
  });
}

async function inJournal(data, journid) {
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
    ...((data.type=="bill" || data.type=="invoice") ? {duedate: data.duedate} : {}),
    company_id: data.company,
  };

  try {
    const inJour = await Journal.create(journal);
    await inEntry(data, inJour);
  } catch (err) {
    console.error('Error in inJournal:', err);
  }
}

async function inEntry(data, inJour) {
  const entryData = data.entry[l];
  const ent = {
    journal_id: inJour.id,
    label: entryData.label,
    date: data.date,
    ...(entryData.debit !== undefined && entryData.debit !== null ? {debit_id: entryData.debits.id,debit: entryData.debit} : {}),
    ...(entryData.credit !== undefined && entryData.credit !== null ? {credit_id: entryData.credits.id, credit: entryData.credit} : {}),
    ...(entryData.product_id ? {product_id: entryData.product_id} : {}),
    ...(entryData.qty ? {qty: entryData.qty} : {}),
    ...(entryData.uom_id ? {uom_id: entryData.uom_id} : {}),
    ...(entryData.price_unit ? {price_unit: entryData.price_unit} : {}),
    ...(entryData.tax ? {tax: entryData.tax} : {}),
    ...(entryData.discount ? {discount: entryData.discount} : {}),
    ...(entryData.subtotal ? {subtotal: entryData.subtotal} : {}),
  };

  try {
    const ents = await Entry.create(ent);
    entries.push(ents);
    await checker(data, inJour);
  } catch (err) {
    console.error('Error in inEntry:', err);
  }
}

async function checker(data, inJour) {
  if (data.entry[l + 1]) {
    l++;
    await inEntry(data, inJour);
  } else {
    l = 0;
    const log = { message: "dibuat", journal: inJour.id, user: data.user };
    try {
      await Log.create(log);
      for (const entry of entries) {
        await inJour.addEntrys(entry);
      }
    } catch (err) {
      console.error('jfunc0002', err);
      // Reject should be removed, as it is not inside a promise executor function.
    }
  }
}


/*function inputJournal(data) {
  return new Promise((resolve, reject) => {
    //console.log("Journal", data);
    const getIdFunction = {
      'miscellaneous': getUpdateJournalId,
      'stock': getUpdateJournalId,
      'payment': getUpdateJournalId,
      'bill': getUpdateBillId,
      'invoice': getUpdateInvId,
      'pos' : getUpdateJournalId,
    };
    if (data.type in getIdFunction) {
      getIdFunction[data.type]()
        .then(id => inJournal(data, id))
          .then(() => resolve('done'))
          .catch(err => {console.error('jfunc0001', err); reject(err); });
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
    ...((data.type=="bill" || data.type=="invoice") ? {duedate: data.duedate} : {}),
    company_id: data.company,
  };
  //console.log("Jour func", journal);
  Journal.create(journal).then(inJour => {
    inEntry(data, inJour);
  });
}

function inEntry(data, inJour) {
  const entryData = data.entry[l];
  //console.log("Ent func entry",entryData);
  const ent = {
    journal_id: inJour.id,
    label: entryData.label,
    date: data.date,
    ...(entryData.debit !== undefined && entryData.debit !== null ? {debit_id: entryData.debits.id,debit: entryData.debit} : {}),
    ...(entryData.credit !== undefined && entryData.credit !== null ? {credit_id: entryData.credits.id, credit: entryData.credit} : {}),
    ...(entryData.product_id ? {product_id: entryData.product_id} : {}),
    ...(entryData.qty ? {qty: entryData.qty} : {}),
    ...(entryData.uom_id ? {uom_id: entryData.uom_id} : {}),
    ...(entryData.price_unit ? {price_unit: entryData.price_unit} : {}),
    ...(entryData.tax ? {tax: entryData.tax} : {}),
    ...(entryData.discount ? {discount: entryData.discount} : {}),
    ...(entryData.subtotal ? {subtotal: entryData.subtotal} : {}),
  };
  //console.log("Ent func", ent);
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
    }).catch(err => {console.error('jfunc0002', err); reject(err); });
  }
}*/

const journal = {
  inputJournal,
};
module.exports = journal;