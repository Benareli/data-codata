const db = require("../models");
const { compare } = require('../function/key.function');
const { productCache } = require('../global/cache.global');
const Product = db.products;
const ProductCat = db.productcats;
const Brand = db.brands;
const Partner = db.partners;
const Uom = db.uoms;
const Log = db.logs;
const User = db.users;
const Tax = db.taxs;
const mongoose = require("mongoose");
const duplicate = [];
const skipped = [];
var Pcateg = '';
var Pbrand = '';
var Ptaxin = '';
var Ptaxout = '';
var Psuom = 'Pcs';
var Ppuom = 'Pcs';

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  Product.find({name: req.body.name}).then(find => {
    if(find.length > 0) res.status(500).send({ message: "Already Existed!" });
    else{
      if(req.body.taxin==""){
        const product = ({
          sku: req.body.sku, name: req.body.name, description: req.body.description, barcode: req.body.barcode,
          fg: req.body.fg ? req.body.fg : false, rm: req.body.rm ? req.body.rm : false, listprice: req.body.listprice,
          botprice: req.body.botprice, cost: req.body.cost ? cost: 0, qoh: req.body.qoh, image: req.body.image,
          isStock: req.body.isStock ? req.body.isStock : false, category: req.body.category, taxout: req.body.taxout,
          brand: req.body.brand, min: req.body.min, max: req.body.max, supplier: req.body.supplier,
          active: req.body.active ? req.body.active : false
        });
        Product.create(product).then(dataa => {
          const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
          Log.create(log).then(datab => {
            updateCache();
            res.send(datab);
          }).catch(err =>{console.error("prod0101",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("prod0102",err.message);res.status(500).send({message:err.message}); });
      }else if(req.body.taxout==""){
        const product = ({
          sku: req.body.sku, name: req.body.name, description: req.body.description, barcode: req.body.barcode,
          fg: req.body.fg ? req.body.fg : false, rm: req.body.rm ? req.body.rm : false, listprice: req.body.listprice,
          botprice: req.body.botprice, suom: req.body.suom, puom: req.body.puom, cost: req.body.cost ? cost: 0,
          qoh: req.body.qoh, image: req.body.image, isStock: req.body.isStock ? req.body.isStock : false,
          category: req.body.category, taxin: req.body.taxin, brand: req.body.brand, min: req.body.min,
          max: req.body.max, supplier: req.body.supplier, active: req.body.active ? req.body.active : false
        });
        Product.create(product).then(dataa => {
          const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
          Log.create(log).then(datab => {
            updateCache();
            res.send(datab);
          }).catch(err =>{console.error("prod0103",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("prod0104",err.message);res.status(500).send({message:err.message}); });
      }else if(req.body.taxout=="" && req.body.taxin==""){
        const product = ({
          sku: req.body.sku, name: req.body.name, description: req.body.description, barcode: req.body.barcode,
          fg: req.body.fg ? req.body.fg : false, rm: req.body.rm ? req.body.rm : false, listprice: req.body.listprice,
          botprice: req.body.botprice, suom: req.body.suom, puom: req.body.puom, cost: req.body.cost ? cost: 0,
          qoh: req.body.qoh, image: req.body.image, isStock: req.body.isStock ? req.body.isStock : false,
          category: req.body.category, brand: req.body.brand, min: req.body.min, max: req.body.max,
          supplier: req.body.supplier, active: req.body.active ? req.body.active : false
        });
        Product.create(product).then(dataa => {
          const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
          Log.create(log).then(datab => {
            updateCache();
            res.send(datab);
          }).catch(err =>{console.error("prod0105",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("prod0106",err.message);res.status(500).send({message:err.message}); });
      }else{
        const product = ({
          sku: req.body.sku, name: req.body.name, description: req.body.description, barcode: req.body.barcode,
          fg: req.body.fg ? req.body.fg : false, rm: req.body.rm ? req.body.rm : false, listprice: req.body.listprice,
          botprice: req.body.botprice, suom: req.body.suom, puom: req.body.puom, cost: req.body.cost ? cost: 0,
          qoh: req.body.qoh, image: req.body.image, isStock: req.body.isStock ? req.body.isStock : false,
          category: req.body.category, taxin: req.body.taxin, taxout: req.body.taxout, brand: req.body.brand,
          min: req.body.min, max: req.body.max, supplier: req.body.supplier, active: req.body.active ? req.body.active : false
        });
        Product.create(product).then(dataa => {
          const log = ({message: "dibuat", product: dataa._id, user: req.body.user,});
          Log.create(log).then(datab => {
            updateCache();
            res.send(datab);
          }).catch(err =>{console.error("prod0107",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("prod0108",err.message);res.status(500).send({message:err.message}); });
      }
    }
  }).catch(err =>{console.error("prod01009",err.message);res.status(500).send({message:err.message}); });
};

// Create and Save new
exports.createMany = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  duplicate.splice(0,duplicate.length);
  skipped.splice(0,duplicate.length);
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Product.find({name: reqs[x].nama}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        ProductCat.find({description: reqs[x].kategori}).then(dataa => {
          if(dataa.length>0) Pcateg = dataa[0]._id;
          else{ skipped.push(x+1); sequencing(x, reqs, users, res); }
          Brand.find({description: reqs[x].merek}).then(datab => {
            if(datab.length>0) Pbrand = datab[0]._id;
            if(!reqs[x].pajakmasuk) reqs[x].pajakmasuk = '..';
            Tax.find({name: reqs[x].pajakmasuk}).then(datac => {
              if(datac.length>0) Ptaxin = datac[0]._id;
              else Ptaxin = null;
              if(!reqs[x].pajakkeluar) reqs[x].pajakkeluar = '..';
              Tax.find({name: reqs[x].pajakkeluar}).then(datad => {
                if(datad.length>0) Ptaxout = datad[0]._id;
                else Ptaxout = null;
                Uom.find({uom_name: reqs[x].satuan_jual}).then(datae => {
                  if(datae) Psuom = datae[0]._id;
                  Uom.find({uom_name: reqs[x].satuan_beli}).then(dataf => {
                    if(dataf) Ppuom = dataf[0]._id;
                
                if(reqs[x].tipe=='barang'||reqs[x].tipe=='Barang'||reqs[x].tipe=="BARANG"){
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].nama,description:reqs[x].deskripsi,
                    barcode:reqs[x].barcode,fg:false,rm:false,listprice:reqs[x].hargajual,qoh:0,
                    botprice:reqs[x].hargabatas,cost:reqs[x].hpp?cost:0,image:"default.png",
                    isStock:true,category:Pcateg,taxin:Ptaxin,taxout:Ptaxout,
                    brand:Pbrand,active:true,min:reqs[x].min,max:reqs[x].max,
                    supplier:reqs[x].supplier,suom:Psuom,puom:Ppuom
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "upload", product: datae._id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{console.error("prod0201",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("prod0202",err.message);res.status(500).send({message:err.message}); });
                }else{
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].nama,description:reqs[x].deskripsi,
                    barcode:reqs[x].barcode,fg:false,rm:false,listprice:reqs[x].hargajual,qoh:0,
                    botprice:reqs[x].hargabatas,cost:reqs[x].hpp?cost:0,image:"default.png",
                    isStock:false,category:Pcateg,taxin:Ptaxin,taxout:Ptaxout,
                    brand:Pbrand,active:true,min:reqs[x].min,max:reqs[x].max,
                    supplier:reqs[x].supplier,suom:Psuom,puom:Ppuom
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "upload", product: datae._id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{console.error("prod0203",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("prod0204",err.message);res.status(500).send({message:err.message}); });
                }

                  }).catch(err =>{console.error("prod0205",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("prod0206",err.message);res.status(500).send({message:err.message}); });
              }).catch(err =>{console.error("prod0207",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("prod0208",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("prod0209",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("prod0210",err.message);res.status(500).send({message:err.message}); });
        
      }
    });
  }else{
    if(duplicate.length>0||skipped.length>0){res.status(500).send(duplicate, skipped);
      duplicate.splice(0,duplicate.length);skipped.splice(0,skipped.length);
      updateCache();
      Pcateg='';Pbrand='';Ptaxin='';Ptaxout='';Psuom='';Ppuom='';}
    else {
      Pcateg='';Pbrand='';Ptaxin='';Ptaxout='';Psuom='';Ppuom='';
      updateCache();
      res.status(200).send({message:"Semua data telah diinput!"});
    }
  }
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

function updateCache() {
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
      }).catch(err =>{console.error("prod0302",err.message);res.status(500).send({message:err.message}); });
}

// Retrieve all from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  
  if(productCache.has('productsAll')){
    res.send(productCache.get('productsAll'));
  }else{
    /*Product.find(condition)
      .populate({ path: 'category', model: ProductCat })
      .populate({ path: 'brand', model: Brand })
      .populate({ path: 'suom', model: Uom })
      .populate({ path: 'puom', model: Uom })
      .then(data => {
        console.log(data[0]);
        myCache.set('productsAll', data);
        res.send(myCache.get('productsAll'));
      }).catch(err =>{console.error("prod0301",err.message);res.status(500).send({message:err.message}); });*/
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
        res.send(productCache.get('productsAll'));
      }).catch(err =>{console.error("prod0301",err.message);res.status(500).send({message:err.message}); });
  }
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findById(req.params.id)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'supplier', model: Partner })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("prod0401",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByDesc = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find(condition)
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0501",err.message);res.status(500).send({message:err.message}); });
};

// Update by the id in the request
exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  Product.find({name: req.body.name}).then(find => {
    if(find.length > 0 && find[0].id != req.params.id) res.status(500).send({ message: "Already Existed!" });
    else{
      const id = req.params.id;
      if (req.body.taxin==""&&req.body.taxout!=""){
        Product.findByIdAndUpdate(id, {$unset: {taxin:1}}, { useFindAndModify: false })
        .then(data => {});
          Product.findByIdAndUpdate(id, {
            sku: req.body.sku, name: req.body.name, description: req.body.description, listprice: req.body.listprice,
            botprice: req.body.botprice, suom: req.body.suom, puom: req.body.puom, cost: req.body.cost, image: req.body.image,
            isStock: req.body.isStock ? req.body.isStock : false, category: req.body.category, taxout: req.body.taxout,
            brand: req.body.brand, active: req.body.active ? req.body.active : false
            },{ useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
            } else {
              const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
              Log.create(log).then(datab => {
                updateCache();
                res.send({ message: "Updated successfully." });
              }).catch(err =>{console.error("prod0601",err.message);res.status(500).send({message:err.message}); });
            }
          }).catch(err => {console.error("prod0602",err.message);res.status(500).send({message:err.message}); });
      }else if (req.body.taxout==""&&req.body.taxin!=""){
        Product.findByIdAndUpdate(id, {$unset: {taxout:1}}, { useFindAndModify: false })
        .then(data => {});
        Product.findByIdAndUpdate(id, {
          sku: req.body.sku, name: req.body.name, description: req.body.description, listprice: req.body.listprice,
          botprice: req.body.botprice, suom: req.body.suom, puom: req.body.puom, cost: req.body.cost, image: req.body.image,
          isStock: req.body.isStock ? req.body.isStock : false, category: req.body.category,
          taxin: req.body.taxin, brand: req.body.brand, active: req.body.active ? req.body.active : false
          },{ useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
            } else {
              const log = ({message: req.body.message, product: req.params.id, user: req.body.user,});
              Log.create(log).then(datab => {
                updateCache();
                res.send({ message: "Updated successfully." });
              }).catch(err =>{console.error("prod0603",err.message);res.status(500).send({message:err.message}); });
            }
          }).catch(err => {console.error("prod0604",err.message);res.status(500).send({message:err.message}); });
      }else if (req.body.taxout=="" && req.body.taxin==""){
        Product.findByIdAndUpdate(id, {$unset: {taxout:1,taxin:1}}, { useFindAndModify: false })
        .then(data => {});
        Product.findByIdAndUpdate(id, {
          sku: req.body.sku, name: req.body.name, description: req.body.description, listprice: req.body.listprice,
          botprice: req.body.botprice, suom: req.body.suom, puom: req.body.puom, cost: req.body.cost, image: req.body.image,
          isStock: req.body.isStock ? req.body.isStock : false, category: req.body.category, brand: req.body.brand,
          active: req.body.active ? req.body.active : false
          },{ useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
            } else {
              const log3 = ({message: req.body.message, product: req.params.id, user: req.body.user});
              Log.create(log3).then(datab => {
                updateCache();
                res.send({ message: "Updated successfully." });
              }).catch(err =>{console.error("prod0605",err.message);res.status(500).send({message:err.message}); });
            }
          }).catch(err => {console.error("prod0606",err.message);res.status(500).send({message:err.message}); });
      }else{
        Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
          } else {
            const log4 = ({message: req.body.message, product: req.params.id, user: req.body.user,});
            Log.create(log4).then(datab => {
              updateCache();
              res.send({ message: "Updated successfully." });
            }).catch(err =>{console.error("prod0607",err.message);res.status(500).send({message:err.message}); });
          }
        }).catch(err =>{console.error("prod0608",err.message);res.status(500).send({message:err.message}); });
      }
    }
  }).catch(err =>{console.error("prod0609",err.message);res.status(500).send({message:err.message}); });
};

// Find all active
exports.findAllActive = (req, res) => {
  //, sort=[( "_id", 1)]
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ active: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'supplier', model: Partner })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0701",err.message);res.status(500).send({message:err.message}); });
};

//Find all stock
exports.findAllStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ isStock: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0801",err.message);res.status(500).send({message:err.message}); });
};

//Find all active stock
exports.findAllActiveStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ active: true, isStock: true })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0901",err.message);res.status(500).send({message:err.message}); });
};

//Find all active ready stock
exports.findAllReady = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ active: true, qoh: {$gt: 0} })
    .populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1001",err.message);res.status(500).send({message:err.message}); });
};

//Find all fg stock
exports.findAllFGStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ fg: false, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

//Find all fg stock
exports.findAllRMStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ rm: false, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

//Find all rm
exports.findAllRM = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ rm: false, fg: false, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

//Find all rm true
exports.findAllRMTrue = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ rm: true, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

//Find all PO Ready
exports.findAllPOReady = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.find({ fg: false, isStock: true })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1201",err.message);res.status(500).send({message:err.message}); });
};