const db = require("../../models");
const { compare } = require('../../function/key.function');
const { productCache } = require('../../global/cache.global');
const Product = db.products;
const Productcat = db.productcats;
const Brand = db.brands;
const Partner = db.partners;
const Uom = db.uoms;
const Log = db.logs;
const User = db.users;
const Tax = db.taxs;
const duplicate = [], skipped = [];
var Pcateg = '', Pbrand = '', Ptaxin = '', Ptaxout = '', Psuom = 'Pcs', Ppuom = 'Pcs';

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  Product.findAll({where:{name: req.body.name}}).then(find => {
    if(find.length > 0) res.status(500).send({ message: "Already Existed!" });
    else{
      const product = ({
        sku: req.body.sku, name: req.body.name, description: req.body.description, barcode: req.body.barcode,
        fg: req.body.fg ? req.body.fg : false, rm: req.body.rm ? req.body.rm : false, listprice: req.body.listprice,
        botprice: req.body.botprice, uom_id: req.body.uom_id, puom_id: req.body.puom_id, cost: req.body.cost ? req.body.cost: 0,
        qoh: req.body.qoh, image: req.body.image, isStock: req.body.isStock ? req.body.isStock : false,
        productcat_id: req.body.productcat_id, tax_id: req.body.tax_id, taxout_id: req.body.taxout_id, brand_id: req.body.brand_id,
        min: req.body.min, max: req.body.max, supplier: req.body.supplier, active: req.body.active ? req.body.active : false
      });
      Product.create(product).then(dataa => {
        const log = ({message: "dibuat", product: dataa.id, user: req.body.user,});
        Log.create(log).then(datab => {
          updateCache();
          res.send(datab);
        }).catch(err =>{console.error("prod0107",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("prod0108",err.message);res.status(500).send({message:err.message}); });
      
    }
  }).catch(err =>{console.error("prod01009",err.message);res.status(500).send({message:err.message}); });
};

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
    Product.findAll({where:{name: reqs[x].nama}}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        Productcat.findAll({where:{description: reqs[x].kategori}}).then(dataa => {
          if(dataa.length>0) Pcateg = dataa[0].id;
          else{ skipped.push(x+1); sequencing(x, reqs, users, res); }
          Brand.findAll({where:{description: reqs[x].merek}}).then(datab => {
            if(datab.length>0) Pbrand = datab[0].id;
            if(!reqs[x].pajakmasuk) reqs[x].pajakmasuk = '..';
            Tax.findAll({where:{name: reqs[x].pajakmasuk}}).then(datac => {
              if(datac.length>0) Ptaxin = datac[0].id;
              else Ptaxin = null;
              if(!reqs[x].pajakkeluar) reqs[x].pajakkeluar = '..';
              Tax.findAll({where:{name: reqs[x].pajakkeluar}}).then(datad => {
                if(datad.length>0) Ptaxout = datad[0].id;
                else Ptaxout = null;
                Uom.findAll({where:{uom_name: reqs[x].satuan_jual}}).then(datae => {
                  if(datae) Psuom = datae[0].id;
                  Uom.findAll({where:{uom_name: reqs[x].satuan_beli}}).then(dataf => {
                    if(dataf) Ppuom = dataf[0].id;
                
                if(reqs[x].tipe=='barang'||reqs[x].tipe=='Barang'||reqs[x].tipe=="BARANG"){
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].nama,description:reqs[x].deskripsi,
                    barcode:reqs[x].barcode,fg:false,rm:false,listprice:reqs[x].hargajual,qoh:0,
                    botprice:reqs[x].hargabatas,cost:reqs[x].hpp?cost:0,image:"default.png",
                    isStock:true,productcat_id:Pcateg,tax_id:Ptaxin,taxout_id:Ptaxout,
                    brand_id:Pbrand,active:true,min:reqs[x].min,max:reqs[x].max,
                    supplier:reqs[x].supplier,uom_id:Psuom,puom_id:Ppuom
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "upload", product: datae.id, user: users,});
                    Log.create(log).then(dataf => {
                      sequencing(x, reqs, users, res);
                    }).catch(err =>{console.error("prod0201",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("prod0202",err.message);res.status(500).send({message:err.message}); });
                }else{
                  const product = ({
                    sku:reqs[x].sku,name:reqs[x].nama,description:reqs[x].deskripsi,
                    barcode:reqs[x].barcode,fg:false,rm:false,listprice:reqs[x].hargajual,qoh:0,
                    botprice:reqs[x].hargabatas,cost:reqs[x].hpp?cost:0,image:"default.png",
                    isStock:false,productcat_id:Pcateg,tax_id:Ptaxin,taxout_id:Ptaxout,
                    brand_id:Pbrand,active:true,min:reqs[x].min,max:reqs[x].max,
                    supplier:reqs[x].supplier,uom_id:Psuom,puom_id:Ppuom
                  })
                  Product.create(product).then(datae => {
                  const log = ({message: "upload", product: datae.id, user: users,});
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
  console.log(productCache.get('productsAll'));
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
    }).catch(err =>{console.error("prod0302",err.message);res.status(500).send({message:err.message}); });
}

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
    Product.findAll({ include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ], raw: true, nest: true})
    .then(product => {
      productCache.set('productsAll', product);
      res.send(product);
    }).catch(err =>{console.error("prod0301",err.message);res.status(500).send({message:err.message}); });
  }


  /*if(productCache.has('productsAll')){
    res.send(productCache.get('productsAll'));
  }else{
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
  }*/
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findByPk(req.params.id
  ,{ include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    /*.populate({ path: 'category', model: ProductCat })
    .populate({ path: 'brand', model: Brand })
    .populate({ path: 'taxin', model: Tax })
    .populate({ path: 'taxout', model: Tax })
    .populate({ path: 'supplier', model: Partner })
    .populate({ path: 'suom', model: Uom })
    .populate({ path: 'puom', model: Uom })*/
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("prod0401",err.message);res.status(500).send({message:err.message}); });
};

exports.findByDesc = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0501",err.message);res.status(500).send({message:err.message}); });
};

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
  Product.findAll({where:{name: req.body.name}}).then(find => {
    if(find.length > 0 && find[0].id != req.params.id) res.status(500).send({ message: "Already Existed!" });
    else{
      Product.update(req.body, {where: {id: req.params.id}})
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
  }).catch(err =>{console.error("prod0609",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ active: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0701",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0801",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllActiveStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ active: true, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0901",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllReady = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ active: true, qoh: {$gt: 0} },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1001",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllFGStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ fg: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllRMStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ rm: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllRM = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ rm: false, fg: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllRMTrue = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ rm: true, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllPOReady = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ fg: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1201",err.message);res.status(500).send({message:err.message}); });
};