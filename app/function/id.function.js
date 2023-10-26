const db = require("../models");
const Id = db.ids;
var result = [];

function getJournalId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      const prefixLength = Math.max(0, 6 - ids[0].journal_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const journid = `${ids[0].pre_journal_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].journal_id}`;
      result[0] = journid;
      result[1] = ids[0].id;
      result[2] = ids[0].journal_id;
      resolve (result);
    }).catch(err =>{console.error("id0101",err); reject(err); });
  })
};

function getJournalId1() {
  return new Promise(resolve => {
    Id.findAll().then(ids => {
      const prefixLength = Math.max(0, 6 - ids[0].journal_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const journid = `${ids[0].pre_journal_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].journal_id}`;
      resolve (journid);
    }).catch(err =>{console.error("id0201",err); reject(err); });
  })
};

function updateJournalId1(journalid, journalcount) {
  return new Promise(resolve => {
    Id.update({journal_id: journalcount+1}, {where:{id: journalid}})
      .then(res => {
        resolve (journid);
    }).catch(err =>{console.error("id0301",err);reject(err); });
  })
};

function updateJournalId2(journalid, journalcount) {
  return new Promise(resolve => {
    Id.update({journal_id: journalcount+2}, {where:{id: journalid}})
      .then(res => {
        resolve (journid);
    }).catch(err =>{console.error("id0401",err); reject(err); });
  })
};

function getUpdateJournalId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      /*if(ids[0].journal_id < 10) prefixes = '00000';
      else if(ids[0].journal_id < 100) prefixes = '0000';
      else if(ids[0].journal_id < 1000) prefixes = '000';
      else if(ids[0].journal_id < 10000) prefixes = '00';
      else if(ids[0].journal_id < 100000) prefixes = '0';
      journid = ids[0].pre_journal_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].journal_id.toString();*/
      const prefixLength = Math.max(0, 6 - ids[0].journal_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const journid = `${ids[0].pre_journal_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].journal_id}`;
      Id.update({journal_id: ids[0].journal_id+1}, {where:{id: ids[0].id}})
      .then(res => {
        resolve (journid);
      }).catch(err =>{console.error("id0501",err); reject(err); });
    }).catch(err =>{console.error("id0502",err); reject(err); });
  })
};

function getUpdateBillId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      const prefixLength = Math.max(0, 6 - ids[0].bill_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const billid = `${ids[0].pre_bill_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].bill_id}`;
      Id.update({bill_id: ids[0].bill_id+1}, {where:{id: ids[0].id}})
      .then(res => {
        resolve (billid);
      }).catch(err =>{console.error("id0601",err); reject(err); });
    }).catch(err =>{console.error("id0602",err); reject(err); });
  })
};

function getUpdateTransId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      const prefixLength = Math.max(0, 6 - ids[0].transfer_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const transid = `${ids[0].pre_transfer_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].transfer_id}`;
      Id.update({transfer_id: ids[0].transfer_id+1}, {where:{id: ids[0].id}})
        .then(datae => {
          resolve (transid);
      }).catch(err =>{console.error("id2001",err); reject(err); });
    }).catch(err =>{console.error("id2002",err); reject(err); });
  })
}

function getTransId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      const prefixLength = Math.max(0, 6 - ids[0].transfer_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const transid = `${ids[0].pre_transfer_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].transfer_id}`;
      result[0] = transid;
      result[1] = ids[0].id;
      result[2] = ids[0].transfer_id;
      resolve (result);
    }).catch(err =>{console.error("id2101",err); reject(err); });
  })
}

function updateTransId(transferid, transfercount) {
  return new Promise((resolve, reject) => {
    Id.update({transfer_id: transfercount+1}, {where:{id: transferid}})
      .then(datae => {
        resolve ("DONE");
      }).catch(err =>{console.error("id2201",err); reject(err); });
  })
}

function getUpdateTicketId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      if(ids[0].ticket_id < 10) prefixes = '00000';
      else if(ids[0].ticket_id < 100) prefixes = '0000';
      else if(ids[0].ticket_id < 1000) prefixes = '000';
      else if(ids[0].ticket_id < 10000) prefixes = '00';
      else if(ids[0].ticket_id < 100000) prefixes = '0';
      ticketid = ids[0].pre_ticket_id+'-'+new Date().getFullYear().toString().substr(-2)+
      '0'+(new Date().getMonth() + 1).toString().slice(-2)+
      prefixes+ids[0].ticket_id.toString();
      Id.update({ticket_id: ids[0].ticket_id+1}, {where:{id: ids[0].id}})
      .then(res => {
        resolve (ticketid);
      }).catch(err =>{console.error("id0501",err); reject(err); });
    }).catch(err =>{console.error("id0502",err); reject(err); });
  })
};

function getUpdateInvId() {
  return new Promise((resolve, reject) => {
    Id.findAll().then(ids => {
      const prefixLength = Math.max(0, 6 - ids[0].invoice_id.toString().length);
      const prefix = '0'.repeat(prefixLength);
      const invid = `${ids[0].pre_invoice_id}-${new Date().getFullYear().toString().substr(-2)}0${(new Date().getMonth() + 1).toString().slice(-2)}${prefix}${ids[0].invoice_id}`;
      Id.update({invoice_id: ids[0].invoice_id+1}, {where:{id: ids[0].id}})
      .then(res => {
        resolve (invid);
      }).catch(err =>{console.error("id0701",err); reject(err); });
    }).catch(err =>{console.error("id0702",err); reject(err); });
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