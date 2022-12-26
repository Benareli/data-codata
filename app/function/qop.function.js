const db = require("../models");
const coa = require("./coa.function");
const id = require("./id.function");
const Qop = db.qops;
const Product = db.products;
const Log = db.logs;
var result = [];

function insertUpdateQop(productid, partnerid, whid, data) {
  return new Promise((resolve, reject) =>{
    //console.log("Into QOP",productid, partnerid, whid, data);
  	Qop.find({product: productid, partner: partnerid, warehouse: whid})
    .then(datas => {
      //console.log(datas);
      if(!datas.length){
        if(data.qin || data.qty_rec){
          if(partnerid){
            //console.log("QOP new In Partner");
            if(data.qty_rec) data.qin = data.qty_rec;
            const qopp = ({product: productid, partner: partnerid, warehouse: whid, 
            cost: data.cost ? data.cost: 0, qop: data.qin, uom: data.uom});
            Qop.create(qopp).then(dataa => {
              var qopid = dataa._id;
              const prod1 = Product.findOneAndUpdate({_id:productid}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
                .then(datab => {
                  const prod2 = Product.find({_id:productid})
                    .then(datac => {
                      var x1 = datac[0].qoh + data.qin;
                      // TODO
                      var y1 = (((datac[0].qoh * datac[0].cost) + (Number(data.qin) * (Number(data.cost) ? data.cost: 0))) / x1).toFixed(2);
                      const prod3 = Product.updateOne({_id:productid},{qoh:x1,cost:y1})
                        .then(datad => {
                          resolve(1);
                      }).catch(err =>{console.error("qopf0101",err.message);reject(err); });
              		}).catch(err =>{console.error("qopf0102",err.message);reject(err); });
              	  }).catch(err =>{console.error("qopf0103",err.message);reject(err); });
          		}).catch(err =>{console.error("qopf0104",err.message);reject(err); });
      	  }else{
            //console.log("QOP new In No-Partner");
      	  	const qopp = ({product: productid, warehouse: whid, 
            cost: data.cost ? data.cost: 0, qop: data.qin, uom: data.uom});
            Qop.create(qopp).then(dataa => {
              var qopid = dataa._id;
              const prod1 = Product.findOneAndUpdate({_id:productid}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
                .then(datab => {
                  const prod2 = Product.find({_id:productid})
                    .then(datac => {
                      var x1 = datac[0].qoh + data.qin;
                      // TODO
                      var y1 = (((datac[0].qoh * datac[0].cost) + (Number(data.qin) * (Number(data.cost) ? data.cost: 0))) / x1).toFixed(2);
                      const prod3 = Product.updateOne({_id:productid},{qoh:x1,cost:y1})
                        .then(datad => {
                          resolve(1);
                      }).catch(err =>{console.error("qopf0105",err.message);reject(err); });
              		}).catch(err =>{console.error("qopf0106",err.message);reject(err); });
              	  }).catch(err =>{console.error("qopf0107",err.message);reject(err); });
          		}).catch(err =>{console.error("qopf0108",err.message);reject(err); });
      	  }
        }else if(data.quot){
          if(partnerid){
            //console.log("QOP new Out Partner");
            const qopp = ({product: productid, partner: partnerid, warehouse: whid, 
            cost: 0, qop: 0-data.qout, uom: data.uom});
            Qop.create(qopp).then(dataa => {
              var qopid = dataa._id;
              const prod1 = Product.findOneAndUpdate({_id:productid}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
                .then(datab => {
                  const prod2 = Product.find({_id:productid})
                  .then(datac => {
                    var x1 = datac[0].qoh - data.qout;
                    const prod3 = Product.updateOne({_id:productid},{qoh:x1})
                      .then(datad => {
                        resolve(1);
                    }).catch(err =>{console.error("qopf0104",err.message);reject(err); });
                  }).catch(err =>{console.error("qopf0106",err.message);reject(err); });
              	}).catch(err =>{console.error("qopf0107",err.message);reject(err); });
          	  }).catch(err =>{console.error("qopf0109",err.message);reject(err); });
      	  }else{
            //console.log("QOP new Out -NoPartner");
      	  	const qopp = ({product: productid, warehouse: whid, 
            cost: 0, qop: 0-data.qout, uom: data.uom});
            Qop.create(qopp).then(dataa => {
              var qopid = dataa._id;
              const prod1 = Product.findOneAndUpdate({_id:productid}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
                .then(datab => {
                  const prod2 = Product.find({_id:productid})
                  .then(datac => {
                    var x1 = datac[0].qoh - data.qout;
                    const prod3 = Product.updateOne({_id:productid},{qoh:x1})
                      .then(datad => {
                        resolve(1);
                    }).catch(err =>{console.error("qopf0104",err.message);reject(err); });
                  }).catch(err =>{console.error("qopf0106",err.message);reject(err); });
              	}).catch(err =>{console.error("qopf0107",err.message);reject(err); });
          	  }).catch(err =>{console.error("qopf0109",err.message);reject(err); });
      	  }
        }
      }else{
        Qop.find({_id: datas[0]._id}).then(datax =>{
          if(data.qin || data.qty_rec){
            //console.log("QOP update In");
            if(data.qty_rec) data.qin = data.qty_rec;
            var x2 = datax[0].qop + data.qin;
            var y2 = (((datax[0].qop * datax[0].cost) + (Number(data.qin) * (Number(data.cost) ? data.cost: 0))) / x2).toFixed(2);
            Qop.updateOne({_id:datas[0]._id},{qop:x2, cost: y2})
            .then(dataa => {
              const prod1 = Product.find({_id:productid})
                .then(datab => {
                  var x1 = datab[0].qoh + data.qin;
                  var y1 = (((datab[0].qoh * datab[0].cost) + (Number(data.qin) * (Number(data.cost) ? data.cost: 0))) / x1).toFixed(2);
                  const prod3 = Product.updateOne({_id:productid},{qoh:x1, cost: y1})
                    .then(datac => {
                      resolve(1);
                  }).catch(err =>{console.error("qopf0110",err.message);reject(err); });
                }).catch(err =>{console.error("qopf0111",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0112",err.message);reject(err); });
          }else if(data.qout){
            //console.log("QOP update In");
            var x2 = datax[0].qop - data.qout;
            Qop.updateOne({_id:datas[0]._id},{qop:x2})
            .then(dataa => {
              const prod1 = Product.find({_id:productid})
                .then(datab => {
                  var x1 = datab[0].qoh - data.qout;
                  const prod3 = Product.updateOne({_id:productid},{qoh:x1})
                    .then(datac => {
                      resolve(1);
                  }).catch(err =>{console.error("qopf0113",err.message);reject(err); });
                }).catch(err =>{console.error("qopf0114",err.message);reject(err); });
              }).catch(err =>{console.error("qopf0115",err.message);reject(err); });
          }
        }).catch(err =>{console.error("qopf0116",err.message);reject(err); });
      }      
    }).catch(err =>{console.error("qopf0117",err.message);reject(err); });
  })
}


const qop = {
  insertUpdateQop,
};
module.exports = qop;