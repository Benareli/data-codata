const db = require("../../models");
const { compare } = require('../../function/key.function');
const Company = db.companys;
const Coa = db.coas;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.company) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  Company.findOne({where:{comp_name: req.body.company}}).then(find => {
    if(find.length > 0) res.status(500).send({ message: "Already Existed!" });
    else{
      const setting = ({
        cost_general: req.body.cost_general ? req.body.cost_general : false,
        comp_name: req.body.comp_name, street: req.body.street,
        street2: req.body.street2, city: req.body.city,
        state: req.body.state, country: req.body.country, zip: req.body.zip,
        comp_phone: req.body.comp_phone, comp_email: req.body.comp_email,
        nav_color: req.body.nav_color ? req.body.nav_color : '#dddddd',
        title_color: req.body.nav_color ? req.body.nav_color : '#333333',
        image: req.body.image,
        restaurant: req.body.restaurant ? req.body.restaurant : false,
        pos_shift: req.body.pos_shift ? req.body.pos_shift : false,
        parent: req.body.parent,
      });
      Company.create(setting).then(dataa => {
        res.send(datab);
      }).catch(err =>{console.error("br0102",err);res.status(500).send({message:err}); });
    }
  }).catch(err =>{console.error("br0103",err);res.status(500).send({message:err}); });
};

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Company.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sett0101",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Company.findByPk(req.params.id)
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("sett0101",err);res.status(500).send({message:err}); });
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
  Company.update(req.body, {where:{id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({message: `Cannot update with id=${id}. Maybe Data was not found!`});
      } else res.send(data);
    }).catch(err =>{console.error("sett0201",err);res.status(500).send({message:err}); });
};