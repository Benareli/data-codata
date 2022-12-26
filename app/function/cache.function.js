const db = require("../models");
const { productCache } = require('../global/cache.global');
const Product = db.products;
var result = [];

function updateProductCache() {
  return new Promise((resolve, reject) => {
    Product.aggregate([
      { $lookup: {
        from: "productcats",
        localField: "category",
        foreignField: "_id",
        as: "map_category"
      }},
      { $unwind: "$map_category" },
      { $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "map_brand"
      }},
      { $unwind: {path: "$map_brand", preserveNullAndEmptyArrays: true }},
      { $lookup: {
        from: "uoms",
        localField: "suom",
        foreignField: "_id",
        as: "map_suom"
      }},
      { $unwind: "$map_suom" },
      {
        $project: {
          _id: 1,
          "sku": "$sku",
          "name": "$name",
          "description": { $ifNull: [ "$description", null ] },
          "barcode": { $ifNull: [ "$barcode", null ] },
          "fg": "$fg",
          "rm": "$rm",
          "listprice": "$listprice",
          "botprice": { $ifNull: [ "$botprice", null ] },
          "cost": { $ifNull: [ "$cost", 0 ] },
          "min": { $ifNull: [ "$min", null ] },
          "max": { $ifNull: [ "$max", null ] },
          "isStock": "$isStock",
          "qoh": "$qoh",
          "image": "$image",
          "category": "$category",
          "suom": "$suom",
          "puom": "$puom",
          "taxin": { $ifNull: [ "$taxin", null ] },
          "taxout": { $ifNull: [ "$taxout", null ] },
          "brand": { $ifNull: [ "$brand", null ] },
          "supplier": { $ifNull: [ "$supplier", null ] },
          "active": "$active",
          "categoryName": "$map_category.description",
          "brandName": { $ifNull: [ "$map_brand.description", "" ] },
          "suomName": "$map_suom.uom_name",
        }
      },
    ])
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
