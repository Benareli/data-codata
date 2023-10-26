const db = require("../../models");
const { compare } = require('../../function/key.function');
const Bom = db.boms;
const Product = db.products;
const Uom = db.uoms;
const Company = db.companys;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.product) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const bom = ({product_id: req.body.product, bom_id: req.body.bom, 
    uom_id: req.body.uom, qty: req.body.qty, company_id: req.body.company});
  Bom.create(bom).then(dataa => {
      res.send(dataa);
    }).catch(err =>{console.error("bom0101",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  const product = req.query.product;
  var condition = product ? { product: { $regex: new RegExp(product), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.findAll({ include: [
      {model: Product, as: "products"},
      {model: Product, as: "bomes"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bom0201",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("bom0301",err);res.status(500).send({message:err}); });
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
  Bom.update(req.body, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({ message: "Updated successfully." });
      }
    }).catch(err =>{console.error("bom0401",err);res.status(500).send({message:err}); });
};

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.destroy({where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({message: "Done"});
      }
    }).catch(err =>{console.error("bom0501",err);res.status(500).send({message:err}); });
};

exports.findByProduct = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Bom.findAll({where:{ product_id: req.params.product }, 
    include: [
      {model: Product, as: "products"},
      {model: Product, as: "bomes"},
      {model: Uom, as: "uoms"},
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("bom0601",err);res.status(500).send({message:err}); });
};

exports.findByProductAggr = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  db.sequelize.query
    ('SELECT public.boms.product_id, public.products.name, COUNT(public.boms.product_id) as totalLine FROM public.boms ' +
      'LEFT JOIN public.products ON public.boms.product_id = public.products.id ' +
      'GROUP BY public.boms.product_id, public.products.name',{raw: true, nest: true})
    .then(result => {
      res.send(result);
    }).catch(err =>{console.error("bom0701",err);res.status(500).send({message:err}); });
};