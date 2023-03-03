const db = require("../models");
const { productCache } = require('../global/cache.global');
const Product = db.products;
const Productcat = db.productcats;
const Brand = db.brands;
const Uom = db.uoms;
const Tax = db.taxs;
var result = [];

function updateProductCache() {
  return new Promise((resolve, reject) => {
    Product.findAll({ include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ], raw: true, nest: true})
    .then(data => {
        productCache.set('productsAll', data);
        resolve(1);
      }).catch(err =>{console.error("prod0302",err.message);reject(0); });
  })
}

const cache = {
  updateProductCache,
};
module.exports = cache;
