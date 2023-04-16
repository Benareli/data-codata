const db = require("../models");
const coa = require("./coa.function");
const id = require("./id.function");
const Lot = db.lots;
const Product = db.products;
const ProductCostComp = db.productcostcomps;
const Log = db.logs;
const Uom = db.uoms;
var result = [];

function insertUpdateStock(type, productid, partnerid, whid, data) {
  return new Promise((resolve, reject) =>{
    //console.log(data);
    //console.log(type, productid, partnerid, whid);
    if(type == "in"){
      checkUom(type, productid, partnerid, whid, data).then(checker =>{
        ProductCostComp.findOne({where:{product_id: productid, company_id: data.company_id}}).then(pcc => {
          if(pcc){
            var x1 = pcc.qoh + checker[0];
            var y1 = (((pcc.qoh * pcc.cost) + (Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0))) / x1).toFixed(2);
            ProductCostComp.update({ qoh:x1, cost: y1 }, { where: { id: pcc.id }}).then(pccu => {
              resolve(1);
            }).catch(err =>{console.error("qopf0111",err.message);reject(err); });
          }else{
            var x1 = checker[0];
            var y1 = ((Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0)) / x1).toFixed(2);
            ProductCostComp.create({ qoh:x1, cost: y1, product_id: productid, company_id: data.company_id }).then(pccc => {
              resolve(1);
            }).catch(err =>{console.error("qopf0112",err.message);reject(err); });
          }
        }).catch(err =>{console.error("qopf0112",err.message);reject(err); });
      }).catch(err =>{console.error("qopf0113",err.message);reject(err); });
    }else if(type == "out"){
      checkUom(type, productid, partnerid, whid, data).then(checker =>{
        ProductCostComp.findOne({where:{product_id: productid, company_id: data.company_id}}).then(pcc => {
          if(pcc){
            var x1 = pcc.qoh - checker[0];
            ProductCostComp.update({ qoh:x1 }, { where: { id: pcc.id }}).then(pccu => {
              resolve(1);
            }).catch(err =>{console.error("qopf0115",err.message);reject(err); });
          }else{
            var x1 = 0 - checker[0];
            ProductCostComp.create({qoh: x1, cost: checker[2], product_id: productid, company_id: data.company_id}).then(pccc => {
              resolve(1);
            }).catch(err =>{console.error("qopf0116",err.message);reject(err); });
          }
        }).catch(err =>{console.error("qopf0117",err.message);reject(err); });
      }).catch(err =>{console.error("qopf0118",err.message);reject(err); });
    }
  	/*Lot.findOne({where:{product_id: productid, partner_id: partnerid, warehouse_id: whid}})
      .then(datas => {
        if(!datas){
          if(type == "in"){
            //console.log("New Qty In");
            checkUom(type, productid, partnerid, whid, data).then(checker =>{
              const qopp = ({product_id: productid, partner_id: partnerid, warehouse_id: whid, 
                cost: checker[2] ? checker[2]: 0, qop: checker[0], uom_id: checker[1]});
              Lot.create(qopp).then(dataa => {
                ProductCostComp.findOne({where:{product_id: productid, company_id: data.company_id}}).then(pcc => {
                  if(pcc){
                    var x1 = pcc.qoh + checker[0];
                    var y1 = (((pcc.qoh * pcc.cost) + (Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0))) / x1).toFixed(2);
                    ProductCostComp.update({ qoh:x1, cost: y1 }, { where: { id: pcc.id }}).then(pccu => {
                      resolve(1);
                    }).catch(err =>{console.error("qopf0101",err.message);reject(err); });
                  }else{
                    var x1 = checker[0];
                    var y1 = ((Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0)) / x1).toFixed(2);
                    ProductCostComp.create({ qoh:x1, cost: y1, product_id: productid, company_id: data.company_id }).then(pccc => {
                      resolve(1);
                    }).catch(err =>{console.error("qopf0102",err.message);reject(err); });
                  }
              	}).catch(err =>{console.error("qopf0103",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0104",err.message);reject(err); });
            }).catch(err =>{console.error("qopf0105",err.message);reject(err); });
          }else if(type == "out"){
            //console.log("New Qty Out");
            checkUom(type, productid, partnerid, whid, data).then(checker =>{
              const qopp = ({product: productid, partner: partnerid, warehouse: whid, 
                cost: checker[2] ? checker[2]:0, qop: 0-checker[0], uom_id: checker[1]});
              Qop.create(qopp).then(dataa => {
                ProductCostComp.findOne({where:{product_id: productid, company_id: data.company_id}}).then(pcc => {
                  if(pcc){
                    var x1 = pcc.qoh - checker[0];
                    ProductCostComp.update({ qoh:x1, cost: y1 }, { where: { id: pcc.id }}).then(pccu => {
                      resolve(1);
                    }).catch(err =>{console.error("qopf0106",err.message);reject(err); });
                  }else{
                    var x1 = 0 - checker[0];
                    ProductCostComp.create({qoh: x1, cost: checker[2], product_id: productid, company_id: data.company_id}).then(pccc => {
                      resolve(1);
                    }).catch(err =>{console.error("qopf0107",err.message);reject(err); });
                  }
                }).catch(err =>{console.error("qopf0108",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0109",err.message);reject(err); });
            }).catch(err =>{console.error("qopf0110",err.message);reject(err); });
          }
        }else{
          Qop.findByPk(datas.id).then(datax =>{
            if(type == "in"){
              //console.log("QOP update In");
              checkUom(type, productid, partnerid, whid, data).then(checker =>{
                var x2 = datax.qop + checker[0];
                var y2 = (((datax.qop * datax.cost) + (Number(checker[0]) * (Number(checker[2])))) / x2).toFixed(2);
                Qop.update({qop:x2, cost: y2}, {where:{id:datas.id}}).then(dataa => {
                  ProductCostComp.findOne({where:{product_id: productid, company_id: data.company_id}}).then(pcc => {
                    if(pcc){
                      var x1 = pcc.qoh + checker[0];
                      var y1 = (((pcc.qoh * pcc.cost) + (Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0))) / x1).toFixed(2);
                      ProductCostComp.update({ qoh:x1, cost: y1 }, { where: { id: pcc.id }}).then(pccu => {
                        resolve(1);
                      }).catch(err =>{console.error("qopf0111",err.message);reject(err); });
                    }else{
                      var x1 = checker[0];
                      var y1 = ((Number(checker[0]) * (Number(checker[2]) ? checker[2]: 0)) / x1).toFixed(2);
                      ProductCostComp.create({ qoh:x1, cost: y1, product_id: productid, company_id: data.company_id }).then(pccc => {
                        resolve(1);
                      }).catch(err =>{console.error("qopf0112",err.message);reject(err); });
                    }
                  }).catch(err =>{console.error("qopf0112",err.message);reject(err); });
                }).catch(err =>{console.error("qopf0113",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0114",err.message);reject(err); });
            }else if(type == "out"){
              //console.log("QOP update Out");
              checkUom(type, productid, partnerid, whid, data).then(checker =>{
                var x2 = datax.qop - checker[0];
                Qop.update({qop:x2}, {where:{id:datas.id}}).then(dataa => {
                  ProductCostComp.findOne({where:{product_id: productid, company_id: data.company_id}}).then(pcc => {
                    if(pcc){
                      var x1 = pcc.qoh - checker[0];
                      ProductCostComp.update({ qoh:x1 }, { where: { id: pcc.id }}).then(pccu => {
                        resolve(1);
                      }).catch(err =>{console.error("qopf0115",err.message);reject(err); });
                    }else{
                      var x1 = 0 - checker[0];
                      ProductCostComp.create({qoh: x1, cost: checker[2], product_id: productid, company_id: data.company_id}).then(pccc => {
                        resolve(1);
                      }).catch(err =>{console.error("qopf0116",err.message);reject(err); });
                    }
                  }).catch(err =>{console.error("qopf0117",err.message);reject(err); });
                }).catch(err =>{console.error("qopf0118",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0119",err.message);reject(err); });
            }
          }).catch(err =>{console.error("qopf0120",err.message);reject(err); });
        }      
      }).catch(err =>{console.error("qopf0121",err.message);reject(err); });*/
  })
}

function checkUom(type, productid, partnerid, whid, data) {
  return new Promise((resolve, reject) =>{
    Product.findByPk(productid).then(prod => {
      if(data.uom_id != prod.uom_id){
        Uom.findByPk(data.uom_id).then(uomz => {
          let cost = data.cost;
          if(data.qty_rec) {
            if(type == "in"){
              cost = data.subtotal / data.qty * data.qty_rec / uomz.ratio;
              let qty = data.qty_rec * uomz.ratio;
              let uom_id = prod.uom_id;
              resolve ([qty, uom_id, cost]);
            }else if(type == "out"){
              //cost = data.subtotal / data.qty * data.qty_rec / uomz.ratio;
              let qty = data.qty_rec * uomz.ratio;
              let uom_id = prod.uom_id;
              resolve ([qty, uom_id, cost]);
            }
          }
        })
      }else{
        let qty = data.qty_rec;
        let uom_id = data.uom_id;
        let cost;
        if(data.subtotal) {
          cost = data.subtotal / data.qty;
        }else{
          cost = data.cost;
        }
        resolve ([qty, uom_id, cost]);
      }
    }).catch(err =>{console.error("qopf0201",err.message);reject(err); });
  })
}

const stock = {
  insertUpdateStock,
};
module.exports = stock;