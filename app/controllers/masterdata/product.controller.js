const db = require("../../models");
const { compare } = require('../../function/key.function');
const { productCache } = require('../../global/cache.global');
const Product = db.products;
const Productcat = db.productcats;
const ProductCostComp = db.productcostcomps;
const Brand = db.brands;
const Partner = db.partners;
const Uom = db.uoms;
const Log = db.logs;
const User = db.users;
const Tax = db.taxs;
const { Op } = require('sequelize');
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
        bund: req.body.bund ? req.body.bund : false, prod: req.body.prod ? req.body.prod : false, listprice: req.body.listprice,
        botprice: req.body.botprice, uom_id: req.body.uom_id, puom_id: req.body.puom_id, 
        image: req.body.image, isStock: req.body.isStock ? req.body.isStock : false,
        productcat_id: req.body.productcat_id, tax_id: req.body.tax_id, taxout_id: req.body.taxout_id, brand_id: req.body.brand_id,
        supplier: req.body.supplier, active: req.body.active ? req.body.active : false,
        nosell: req.body.nosell
      });
      Product.create(product).then(dataa => {
        const log = ({message: "dibuat", product: dataa.id, user: req.body.user,});
        Log.create(log).then(datab => {
          const pcc = ({
            product_id: dataa.id,
            company_id: Number(req.body.company),
            cost: req.body.cost ? req.body.cost : 0,
            qoh: 0,
            min: req.body.min,
            max: req.body.max
          });
          ProductCostComp.create(pcc).then(datab => {
            updateCache(req.body.company);
            res.send(datab);
          }).catch(err => {console.error("prod0107",err); res.status(500).send({message:err}); });
        }).catch(err => {console.error("prod0108",err); res.status(500).send({message:err}); });
      }).catch(err => {console.error("prod0109",err); res.status(500).send({message:err}); });      
    }
  }).catch(err =>{console.error("prod01010",err);res.status(500).send({message:err}); });
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
                    const product = ({
                      sku: reqs[x].sku, name: reqs[x].nama, description: reqs[x].deskripsi,
                      barcode: reqs[x].barcode, fg: false, rm: false, listprice: reqs[x].hargajual,
                      botprice:reqs[x]. hargabatas, image: "default.png",
                      ...((reqs[x].tipe=='barang'||reqs[x].tipe=='Barang'||reqs[x].tipe=="BARANG") ? {isStock: true} : {isStock: false}),
                      productcat_id: Pcateg, tax_id: Ptaxin, taxout_id: Ptaxout, brand_id: Pbrand,
                      active: true, supplier: reqs[x].supplier, uom_id: Psuom,puom_id:Ppuom
                    })
                    Product.create(product).then(datae => {
                    const log = ({message: "upload", product: datae.id, user: users,});
                      Log.create(log).then(dataf => {
                        ProductCostComp.create({
                          product_id: datae.id, company_id: req.body.company, qoh: 0, 
                          cost: reqs[x].hpp ? cost:0, min: reqs[x].min, max: reqs[x].max}).then(datag => {
                          sequencing(x, reqs, users, res);
                        }).catch(err =>{console.error("prod0201",err);res.status(500).send({message:err}); });
                      }).catch(err =>{console.error("prod0202",err);res.status(500).send({message:err}); });
                    }).catch(err =>{console.error("prod0203",err);res.status(500).send({message:err}); });
                  }).catch(err =>{console.error("prod0204",err);res.status(500).send({message:err}); });
                }).catch(err =>{console.error("prod0205",err);res.status(500).send({message:err}); });
              }).catch(err =>{console.error("prod0206",err);res.status(500).send({message:err}); });
            }).catch(err =>{console.error("prod0207",err);res.status(500).send({message:err}); });
          }).catch(err =>{console.error("prod0208",err);res.status(500).send({message:err}); });
        }).catch(err =>{console.error("prod0209",err);res.status(500).send({message:err}); });
      }
    });
  }else{
    if(duplicate.length>0||skipped.length>0){res.status(500).send(duplicate, skipped);
      duplicate.splice(0,duplicate.length);skipped.splice(0,skipped.length);
      updateCache(1);
      Pcateg='';Pbrand='';Ptaxin='';Ptaxout='';Psuom='';Ppuom='';}
    else {
      Pcateg='';Pbrand='';Ptaxin='';Ptaxout='';Psuom='';Ppuom='';
      updateCache(1);
      res.status(200).send({message:"Semua data telah diinput!"});
    }
  }
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

function updateCache(company) {
  Product.findAll({ include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: company }},
    ], raw: true, nest: true})
    .then(data => {
      productCache.set('productsAll', data);
    }).catch(err =>{console.error("prod0302",err);res.status(500).send({message:err}); });
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
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ], raw: true, nest: true})
    .then(product => {
      productCache.set('productsAll', product);
      res.send(product);
    }).catch(err =>{console.error("prod0301",err);res.status(500).send({message:err}); });
  }
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
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("prod0401",err);res.status(500).send({message:err}); });
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
    }).catch(err =>{console.error("prod0501",err);res.status(500).send({message:err}); });
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
              ProductCostComp.findOne({where:{product_id: req.params.id, company_id: req.body.company}}).then(datac => {
                if (!datac) {
                  return ProductCostComp.create({product_id: req.params.id, company_id: req.body.company, cost: req.body.cost});
                }
                return ProductCostComp.update({ cost: req.body.cost }, { where: { id: datac.id } });
              }).then(() => {
                updateCache(1);
                res.send({ message: 'Updated successfully.' });
              }).catch(err =>{console.error("prod0609",err);res.status(500).send({message:err}); });
            }).catch(err =>{console.error("prod0610",err);res.status(500).send({message:err}); });
          }
        }).catch(err =>{console.error("prod0611",err);res.status(500).send({message:err}); });
      
    }
  }).catch(err =>{console.error("prod0609",err);res.status(500).send({message:err}); });
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
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0701",err);res.status(500).send({message:err}); });
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
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0801",err);res.status(500).send({message:err}); });
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
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod0901",err);res.status(500).send({message:err}); });
};

exports.findAllReady = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ nosell: false, active: true},
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
      {
        model: ProductCostComp,
        as: "productcostcomps",
        where: {
          company_id: req.params.comp
        },
      },
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1001",err);res.status(500).send({message:err}); });
};

exports.findAllFGStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ bund: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1101",err);res.status(500).send({message:err}); });
};

exports.findAllRMStock = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ prod: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1201",err);res.status(500).send({message:err}); });
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
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1301",err);res.status(500).send({message:err}); });
};

exports.findAllRMTrue = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ prod: true, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1401",err);res.status(500).send({message:err}); });
};

exports.findAllPOReady = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Product.findAll({where:{ bund: false, prod: false, isStock: true },
    include: [
      {model: Productcat, as: "productcats"},
      {model: Brand, as: "brands"},
      {model: Uom, as: "uoms"},
      {model: Uom, as: "puoms"},
      {model: Tax, as: "taxs"},
      {model: Tax, as: "taxouts"},
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1501",err);res.status(500).send({message:err}); });
};

exports.findAllSOReady = (req, res) => {
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
      {model: ProductCostComp, as: "productcostcomps", where: { company_id: req.params.comp }},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1601",err);res.status(500).send({message:err}); });
};

exports.getCostComp = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCostComp.findOne({where:{product_id: req.params.prod, company_id: req.params.comp}})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("prod1701",err);res.status(500).send({message:err}); });
};