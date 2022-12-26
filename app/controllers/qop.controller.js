const db = require("../models");
const { compare } = require('../function/key.function');
const Qop = db.qops;
const Product = db.products;
const Uom = db.uoms;
const Partner = db.partners;
const Warehouse = db.warehouses;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Create and Save new
exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  // Create
  const qop = new Qop({
    product: mongoose.Types.ObjectId(req.body.product),
    partner: mongoose.Types.ObjectId(req.body.partner),
    warehouse: mongoose.Types.ObjectId(req.body.warehouse),
    cost: req.body.cost ? req.body.cost: 0,
    qop: req.body.qop,
    uom: req.body.uom
  });
  // Save in the database
  qop
    .save(qop)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("qop0101",err.message);res.status(500).send({message:err.message}); });
};

// Create and Update Product new
exports.createUpdate = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  // Find first
  if(req.body.partner != "null"){
    Qop.find({product: req.body.product, partner: req.body.partner, warehouse: req.body.warehouse})
      .then(data => {
        if(data.length < 1){
          const qopp = ({product: req.body.product, partner: req.body.partner, warehouse: req.body.warehouse, 
            cost: req.body.cost ? req.body.cost: 0, qop: req.body.qop, uom: req.body.uom});
          Qop.create(qopp).then(dataa => {
            var qopid = dataa._id;
            const prod1 = Product.findOneAndUpdate({_id:req.body.product}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                const prod2 = Product.find({_id:req.body.product})
                  .then(datac => {
                    var x = datac[0].qoh + req.body.qop;
                    var y = (((datac[0].qoh * datac[0].cost) + (Number(req.body.qop) * (Number(req.body.cost) ? req.body.cost: 0))) / x).toFixed(2);
                    const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                      .then(datad => {
                        res.send(datad);
                      }).catch(err =>{console.error("qop0201",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("qop0202",err.message);res.status(500).send({message:err.message}); });
              }).catch(err =>{console.error("qop0203",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("qop0204",err.message);res.status(500).send({message:err.message}); });
        }else{
          Qop.find({_id: data[0]._id}).then(datax =>{
            if(req.body.qop>0){
            var x = ((datax[0].qop * datax[0].cost) + (Number(req.body.qop) * (Number(req.body.cost) ? req.body.cost: 0)))
            / (datax[0].qop + Number(req.body.qop));}
            else{var x=datax[0].cost}
            Qop.updateOne({_id:data[0]._id},{qop: data[0].qop+Number(req.body.qop), cost:x})
            .then(dataa => {
              const prod1 = Product.find({_id:req.body.product})
                .then(datab => {
                  var x = datab[0].qoh + req.body.qop;
                  var y = (((datab[0].qoh * datab[0].cost) + (Number(req.body.qop) * (Number(req.body.cost) ? req.body.cost: 0))) / x).toFixed(2);
                  const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                    .then(datac => {
                      res.send(datac);
                    }).catch(err =>{console.error("qop0205",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("qop0206",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("qop0207",err.message);res.status(500).send({message:err.message}); });
          });
        }
      }).catch(err =>{console.error("qop0208",err.message);res.status(500).send({message:err.message}); });
  }else{
    Qop.find({product: req.body.product, partner: { $exists : false }, warehouse: req.body.warehouse})
      .then(data => {
        if(data.length < 1){
          const qopp = ({product: req.body.product, warehouse: req.body.warehouse, 
            cost: req.body.cost ? req.body.cost: 0, qop: req.body.qop, uom: req.body.uom});
          Qop.create(qopp).then(dataa => {
            console.log(qopp);
            var qopid = dataa._id;
            const prod1 = Product.findOneAndUpdate({_id:req.body.product}, {$push: {qop: dataa._id}}, { useFindAndModify: false })
              .then(datab => {
                const prod2 = Product.find({_id:req.body.product})
                  .then(datac => {
                    var x = datac[0].qoh + req.body.qop;
                    var y = (((datac[0].qoh * datac[0].cost) + (Number(req.body.qop) * (Number(req.body.cost) ? req.body.cost: 0))) / x).toFixed(2);
                    const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                      .then(datad => {
                        res.send(datad);
                      }).catch(err =>{console.error("qop0209",err.message);res.status(500).send({message:err.message}); });
                  }).catch(err =>{console.error("qop0210",err.message);res.status(500).send({message:err.message}); });
              }).catch(err =>{console.error("qop0211",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("qop0212",err.message);res.status(500).send({message:err.message}); });
        }else{
          Qop.find({_id: data[0]._id}).then(datax =>{
            if(req.body.qop>0){
            var x = ((datax[0].qop * datax[0].cost) + (Number(req.body.qop) * (Number(req.body.cost) ? req.body.cost: 0)))
            / (datax[0].qop + Number(req.body.qop));}
            else{var x=datax[0].cost}
            Qop.updateOne({_id:data[0]._id},{qop: data[0].qop+Number(req.body.qop), cost:x})
            .then(dataa => {
              const prod1 = Product.find({_id:req.body.product})
                .then(datab => {
                  var x = datab[0].qoh + req.body.qop;
                  var y = (((datab[0].qoh * datab[0].cost) + (Number(req.body.qop) * (Number(req.body.cost) ? req.body.cost: 0))) / x).toFixed(2);
                  const prod3 = Product.updateOne({_id:req.body.product},{qoh:x,cost:y})
                    .then(datac => {
                      res.send(datac);
                    }).catch(err =>{console.error("qop0213",err.message);res.status(500).send({message:err.message}); });
                }).catch(err =>{console.error("qop0214",err.message);res.status(500).send({message:err.message}); });
            }).catch(err =>{console.error("qop0215",err.message);res.status(500).send({message:err.message}); });
          })
        }
      }).catch(err =>{console.error("qop0216",err.message);res.status(500).send({message:err.message}); });
  }
};


// Retrieve all from the database.
exports.findAll = (req, res) => {
  /*const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  var o_id = mongoose.Types.ObjectId(req.query.product);*/
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Qop.find({product: req.query.product})
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("qop0301",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Qop.findById(req.params.id)
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("qop0401",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByProduct = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qop.find({product: req.params.product,warehouse: req.params.warehouse})
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("qop0501",err.message);res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByProduct2 = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qop.find({product: req.headers.product,warehouse: req.headers.warehouse})
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'warehouse', model: Warehouse })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("qop0501",err.message);res.status(500).send({message:err.message}); });
  }
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
  Qop.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    }).catch(err =>{console.error("qop0601",err.message);res.status(500).send({message:err.message}); });
};

// Find a single with an desc
exports.findByProd = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qop.aggregate([
    { $match: {
      product: ObjectId(req.params.product)
    }},
    { $lookup: {
        from: "warehouses",
        localField: "warehouse",
        foreignField: "_id",
        as: "map_wh"
      }},
    { $unwind: "$map_wh" },
    {
      $group:
      {
        _id: { warehouse: "$map_wh.name" },
        totalLine: { $sum: 1 },
        totalQop: { $sum: "$qop" }
      }
    }
    ])
    .then(result => {
        res.send(result)
    }).catch(err =>{console.error("qop0701",err.message);res.status(500).send({message:err.message}); });
  }
};

// Find a single with an desc
exports.findByWh = (req, res) => {
  if(compare(req, res)==0 || !req.headers.apikey) res.status(401).send({ message: "Unauthorized!" });
  else{
  Qop.find({warehouse: req.params.warehouse})
    .populate({ path: 'partner', model: Partner })
    .populate({ path: 'product', model: Product })
    .populate({ path: 'uom', model: Uom })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("qop0801",err.message);res.status(500).send({message:err.message}); });
  }
};