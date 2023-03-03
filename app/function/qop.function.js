const db = require("../models");
const coa = require("./coa.function");
const id = require("./id.function");
const Qop = db.qops;
const Product = db.products;
const Log = db.logs;
const Uom = db.uoms;
var result = [];

function insertUpdateQop(productid, partnerid, whid, data) {
  return new Promise((resolve, reject) =>{
  	Qop.findOne({where:{product_id: productid, partner_id: partnerid, warehouse_id: whid}})
      .then(datas => {
        if(!datas){
          if(data.qin || data.qty_rec){
            checkUom(productid, partnerid, whid, data).then(checker =>{
              const qopp = ({product_id: productid, partner_id: partnerid, warehouse_id: whid, 
                cost: checker[2] ? checker[2]: 0, qop: checker[0], uom_id: checker[1]});
              Qop.create(qopp).then(dataa => {
                Product.findByPk(productid).then(datac => {
                  var x1 = datac.qoh + checker[0];
                  var y1 = (((datac.qoh * datac.cost) + (Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0))) / x1).toFixed(2);
                    Product.update({qoh:x1,cost:y1}, {where:{id:productid}}).then(datad => {
                      resolve(1);
                    }).catch(err =>{console.error("qopf0101",err.message);reject(err); });
              		}).catch(err =>{console.error("qopf0102",err.message);reject(err); });
              	}).catch(err =>{console.error("qopf0103",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0104",err.message);reject(err); });
        }else if(data.quot){
          checkUom(productid, partnerid, whid, data).then(checker =>{
            const qopp = ({product: productid, partner: partnerid, warehouse: whid, 
              cost: checker[2] ? checker[2]:0, qop: 0-checker[0], uom_id: checker[1]});
            Qop.create(qopp).then(dataa => {
              Product.findByPk(productid).then(datac => {
                var x1 = datac.qoh - checker[0];
                Product.update({qoh:x1}, {where:{id:productid}}).then(datad => {
                  resolve(1);
                }).catch(err =>{console.error("qopf0105",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0106",err.message);reject(err); });
            }).catch(err =>{console.error("qopf0107",err.message);reject(err); });
          }).catch(err =>{console.error("qopf0108",err.message);reject(err); });
        }
      }else{
        Qop.findByPk(datas.id).then(datax =>{
          if(data.qin || data.qty_rec){
            //console.log("QOP update In");
            checkUom(productid, partnerid, whid, data).then(checker =>{
              var x2 = datax.qop + checker[0];
              var y2 = (((datax.qop * datax.cost) + (Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0))) / x2).toFixed(2);
              Qop.update({qop:x2, cost: y2}, {where:{id:datas.id}}).then(dataa => {
                Product.findByPk(productid).then(datab => {
                  var x1 = datab.qoh + checker[0];
                  var y1 = (((datab.qoh * datab.cost) + (Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0))) / x1).toFixed(2);
                    Product.update({qoh:x1, cost: y1},{where:{id:productid}}).then(datac => {
                      resolve(1);
                    }).catch(err =>{console.error("qopf0110",err.message);reject(err); });
                  }).catch(err =>{console.error("qopf0111",err.message);reject(err); });
                }).catch(err =>{console.error("qopf0112",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0113",err.message);reject(err); });
          }else if(data.qout){
            //console.log("QOP update Out");
            checkUom(productid, partnerid, whid, data).then(checker =>{
              var x2 = datax.qop - checker[0];
              Qop.update({qop:x2}, {where:{id:datas.id}}).then(dataa => {
                Product.findByPk(productid).then(datab => {
                  var x1 = datab.qoh - checker[0];
                  Product.update({qoh:x1},{where:{id:productid}}).then(datac => {
                    resolve(1);
                  }).catch(err =>{console.error("qopf0113",err.message);reject(err); });
                }).catch(err =>{console.error("qopf0114",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0115",err.message);reject(err); });
            }).catch(err =>{console.error("qopf0116",err.message);reject(err); });
          }
        }).catch(err =>{console.error("qopf0117",err.message);reject(err); });
      }      
    }).catch(err =>{console.error("qopf0118",err.message);reject(err); });
  })
}

function checkUom(productid, partnerid, whid, data) {
  return new Promise((resolve, reject) =>{
    Product.findByPk(productid).then(prod => {
      if(data.uom_id != prod.uom_id){
        Uom.findByPk(data.uom_id).then(uomz => {
          let cost;
          cost = data.cost;
          if(data.subtotal) data.cost = data.subtotal;
          if(data.qty_rec) {
            data.qty = data.qty_rec;
            cost = data.cost / data.qty_rec / uomz.ratio;
          }else if(data.qin) {
            data.qty = data.qin;
            cost = data.cost / data.qin / uomz.ratio;
          }else if(data.qout) {
            data.qty = data.qout;
            cost = data.cost * uomz.ratio;
          }
          let qty = data.qty * uomz.ratio;
          let uom_id = prod.uom_id;
          resolve ([qty, uom_id, cost]);
        })
      }else{
        if(data.qty_rec) data.qty = data.qty_rec;
        if(data.qin) data.qty = data.qin;
        if(data.qout) data.qty = data.qout;
        let qty = data.qty;
        let uom_id = data.uom_id;
        let cost = data.cost;
        cost = data.cost;
        if(data.subtotal) data.cost = data.subtotal;
        resolve ([qty, uom_id, cost]);
      }
    }).catch(err =>{console.error("qopf0201",err.message);reject(err); });
  })
}

const qop = {
  insertUpdateQop,
};
module.exports = qop;