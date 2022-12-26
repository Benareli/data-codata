const db = require("../models");
const Id = db.ids;
var result = [];

function getJournalId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].journal_id < 10) prefixes = '00000';
      else if(ids[0].journal_id < 100) prefixes = '0000';
      else if(ids[0].journal_id < 1000) prefixes = '000';
      else if(ids[0].journal_id < 10000) prefixes = '00';
      else if(ids[0].journal_id < 100000) prefixes = '0';
      journid = ids[0].pre_journal_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].journal_id.toString();
      result[0] = journid;
      result[1] = ids[0]._id;
      result[2] = ids[0].journal_id;
      resolve (result);
    }).catch(err =>{console.error("id0101",err.message); reject(err); });
  })
};

function getJournalId1() {
  return new Promise(resolve => {
    Id.find().then(ids => {
      if(ids[0].journal_id < 10) prefixes = '00000';
      else if(ids[0].journal_id < 100) prefixes = '0000';
      else if(ids[0].journal_id < 1000) prefixes = '000';
      else if(ids[0].journal_id < 10000) prefixes = '00';
      else if(ids[0].journal_id < 100000) prefixes = '0';
      journid = ids[0].pre_journal_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+(Number(ids[0].journal_id)+1).toString();
      resolve (journid);
    }).catch(err =>{console.error("id0201",err.message); reject(err); });
  })
};

function updateJournalId1(journalid, journalcount) {
  return new Promise(resolve => {
    Id.findOneAndUpdate({_id: journalid}, {journal_id: journalcount+1}, {useFindAndModify: false})
      .then(res => {
        resolve (journid);
    }).catch(err =>{console.error("id0301",err.message);reject(err); });
  })
};

function updateJournalId2(journalid, journalcount) {
  return new Promise(resolve => {
    Id.findOneAndUpdate({_id: journalid}, {journal_id: journalcount+2}, {useFindAndModify: false})
      .then(res => {
        resolve (journid);
    }).catch(err =>{console.error("id0401",err.message); reject(err); });
  })
};

function getUpdateJournalId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].journal_id < 10) prefixes = '00000';
      else if(ids[0].journal_id < 100) prefixes = '0000';
      else if(ids[0].journal_id < 1000) prefixes = '000';
      else if(ids[0].journal_id < 10000) prefixes = '00';
      else if(ids[0].journal_id < 100000) prefixes = '0';
      journid = ids[0].pre_journal_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].journal_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {journal_id: ids[0].journal_id+1}, {useFindAndModify: false})
      .then(res => {
        resolve (journid);
      }).catch(err =>{console.error("id0501",err.message); reject(err); });
    }).catch(err =>{console.error("id0502",err.message); reject(err); });
  })
};

function getUpdateBillId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].bill_id < 10) prefixes = '00000';
      else if(ids[0].bill_id < 100) prefixes = '0000';
      else if(ids[0].bill_id < 1000) prefixes = '000';
      else if(ids[0].bill_id < 10000) prefixes = '00';
      else if(ids[0].bill_id < 100000) prefixes = '0';
      billid = ids[0].pre_bill_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].bill_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {bill_id: ids[0].bill_id+1}, {useFindAndModify: false})
      .then(res => {
        resolve (billid);
      }).catch(err =>{console.error("id0601",err.message); reject(err); });
    }).catch(err =>{console.error("id0602",err.message); reject(err); });
  })
};

function getUpdateTransId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].transfer_id < 10) prefixes = '00000';
      else if(ids[0].transfer_id < 100) prefixes = '0000';
      else if(ids[0].transfer_id < 1000) prefixes = '000';
      else if(ids[0].transfer_id < 10000) prefixes = '00';
      else if(ids[0].transfer_id < 100000) prefixes = '0';
      transid = ids[0].pre_transfer_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+prefixes+ids[0].transfer_id.toString();
      Id.findOneAndUpdate({_id: ids}, {transfer_id: ids[0].transfer_id+1}, {useFindAndModify: false})
        .then(datae => {
          resolve (transid);
      }).catch(err =>{console.error("id2001",err.message); reject(err); });
    }).catch(err =>{console.error("id2002",err.message); reject(err); });
  })
}

function getTransId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].transfer_id < 10) prefixes = '00000';
      else if(ids[0].transfer_id < 100) prefixes = '0000';
      else if(ids[0].transfer_id < 1000) prefixes = '000';
      else if(ids[0].transfer_id < 10000) prefixes = '00';
      else if(ids[0].transfer_id < 100000) prefixes = '0';
      transid = ids[0].pre_transfer_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+prefixes+ids[0].transfer_id.toString();
      result[0] = transid;
      result[1] = ids[0]._id;
      result[2] = ids[0].transfer_id;
      resolve (result);
    }).catch(err =>{console.error("id2101",err.message); reject(err); });
  })
}

function updateTransId() {
  return new Promise((resolve, reject) => {
    Id.findOneAndUpdate({_id: ids}, {transfer_id: ids[0].transfer_id+1}, {useFindAndModify: false})
      .then(datae => {
        resolve ("DONE");
      }).catch(err =>{console.error("id2201",err.message); reject(err); });
  })
}

function getUpdateTicketId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].ticket_id < 10) prefixes = '00000';
      else if(ids[0].ticket_id < 100) prefixes = '0000';
      else if(ids[0].ticket_id < 1000) prefixes = '000';
      else if(ids[0].ticket_id < 10000) prefixes = '00';
      else if(ids[0].ticket_id < 100000) prefixes = '0';
      ticketid = ids[0].pre_ticket_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].ticket_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {ticket_id: ids[0].ticket_id+1}, {useFindAndModify: false})
      .then(res => {
        resolve (ticketid);
      }).catch(err =>{console.error("id0501",err.message); reject(err); });
    }).catch(err =>{console.error("id0502",err.message); reject(err); });
  })
};

function getUpdateInvId() {
  return new Promise((resolve, reject) => {
    Id.find().then(ids => {
      if(ids[0].invoice_id < 10) prefixes = '00000';
      else if(ids[0].invoice_id < 100) prefixes = '0000';
      else if(ids[0].invoice_id < 1000) prefixes = '000';
      else if(ids[0].invoice_id < 10000) prefixes = '00';
      else if(ids[0].invoice_id < 100000) prefixes = '0';
      invid = ids[0].pre_invoice_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].invoice_id.toString();
      Id.findOneAndUpdate({_id: ids[0]._id}, {invoice_id: ids[0].invoice_id+1}, {useFindAndModify: false})
      .then(res => {
        resolve (invid);
      }).catch(err =>{console.error("id0701",err.message); reject(err); });
    }).catch(err =>{console.error("id0702",err.message); reject(err); });
  })
};

const id = {
  getJournalId,
  getJournalId1,
  updateJournalId1,
  updateJournalId2,
  getUpdateJournalId,
  getUpdateBillId,
  getUpdateInvId,
  getUpdateTransId,
  getTransId,
  updateTransId,
  getUpdateTicketId
};
module.exports = id;