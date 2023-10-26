const db = require("../models");
const Coa = db.coas;
var result = [];

function getCoa(coa1) {
  return new Promise((resolve, reject) => {
    Coa.findAll().then(data => {
      let o = data.findIndex((obj => obj.code == coa1));
      result[0] = data[o];
      resolve (result);
    }).catch(err =>{console.error("coa0101",err); reject(err); });
  })
};

function getCoa2(coa1, coa2) {
  return new Promise((resolve, reject) => {
    Coa.findAll().then(data => {
      let o = data.findIndex((obj => obj.code == coa1));
      let p = data.findIndex((pbj => pbj.code == coa2));
      result[0] = data[o];
      result[1] = data[p];
      resolve (result);
    }).catch(err =>{console.error("coa0201",err); reject(err); });
  })
};

function getCoa3(coa1, coa2, coa3) {
  return new Promise((resolve, reject) => {
    Coa.findAll().then(data => {
      let o = data.findIndex((obj => obj.code == coa1));
      let p = data.findIndex((pbj => pbj.code == coa2));
      let q = data.findIndex((qbj => qbj.code == coa3));
      result[0] = data[o].id;
      result[1] = data[p].id;
      result[2] = data[q].id;
      resolve (result);
    }).catch(err =>{console.error("coa0202",err); reject(err); });
  })
};

function getCoaPayment(x, req) {
  return new Promise((resolve, reject) => {
    Coa.findAll().then(data => {
      let o = data.findIndex((obj => obj.code == '1-2001'));
      let k = data.findIndex((kbj => kbj.code == '1-1001'));
      let b = data.findIndex((bbj => bbj.code == '1-1101'));
      let c = data.findIndex((cbj => cbj.code == '1-1111'));
      let oo = data[o].id;
      var pp;
      if(x==1){
      	if(req.pay1method=="tunai") pp = data[k].id;
      	else if(req.pay1method=="bank") pp = data[b].id;
   	  	else if(req.pay1method=="cc") pp = data[c].id;
      }else if(x==2){
      	if(req.pay2method=="tunai") pp = data[k].id;
      	else if(req.pay2method=="bank") pp = data[b].id;
   	  	else if(req.pay2method=="cc") pp = data[c].id;
      }else if(x==3){
      	pp = data[k].id;
      }
      result[0] = oo;
      result[1] = pp;
      resolve (result);
    }).catch(err =>{console.error("coa0301",err); reject(err); });
  })
};

function getCoaPayout(x, req) {
  return new Promise((resolve, reject) => {
    Coa.findAll().then(data => {
      let o = data.findIndex((obj => obj.code == '2-1001'));
      let k = data.findIndex((kbj => kbj.code == '1-1001'));
      let b = data.findIndex((bbj => bbj.code == '1-1101'));
      let c = data.findIndex((cbj => cbj.code == '1-1111'));
      let oo = data[o].id;
      var pp;
      if(x==1){
        if(req.pay_method=="tunai") pp = data[k].id;
        else if(req.pay_method=="bank") pp = data[b].id;
        else if(req.pay_method=="cc") pp = data[c].id;
      }else if(x==3){
        pp = data[k].id;
      }
      result[0] = oo;
      result[1] = pp;
      resolve (result);
    }).catch(err =>{console.error("coa0302",err); reject(err); });
  })
};

function getCoaPos() {
  return new Promise((resolve, reject) => {
    Coa.find().then(data => {
      let o = data.findIndex((obj => obj.code == '4-1001'));
      let p = data.findIndex((pbj => pbj.code == '1-2001'));
      let q = data.findIndex((qbj => qbj.code == '2-4001'));
      result[0] = data[o]._id;
      result[1] = data[p]._id;
      result[2] = data[q]._id;
      resolve (result);
    }).catch(err =>{console.error("coa0401",err); reject(err); });
  })
};

const coa = {
  getCoa,
  getCoa2,
  getCoa3,
  getCoaPayment,
  getCoaPayout,
  getCoaPos
};
module.exports = coa;