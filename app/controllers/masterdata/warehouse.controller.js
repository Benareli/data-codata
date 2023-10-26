const db = require("../../models");
const { compare } = require('../../function/key.function');
const Warehouse = db.warehouses;
const Log = db.logs;
const User = db.users;
const Company = db.companys;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const warehouse = ({name: req.body.name, short: req.body.short, company_id: req.body.companyid,
    main: req.body.main ? req.body.main : false, active: req.body.active ? req.body.active : false});
  Warehouse.create(warehouse).then(dataa => {
    const log = ({message: "dibuat", warehouse: dataa._id, user: req.body.user,});
    Log.create(log).then(datab => {
      res.send(datab);
    }).catch(err =>{console.error("wh0101",err);res.status(500).send({message:err}); });
  }).catch(err =>{console.error("wh0102",err);res.status(500).send({message:err}); });
};

exports.createMany = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  duplicate.splice(0,duplicate.length);
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Warehouse.findAll({where:{description: reqs[x].nama}}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        const wh = ({short: reqs[x].kode, name: reqs[x].nama, active: true});
        Warehouse.create(wh).then(dataa => {
          const log = ({message: "upload", warehouse: dataa.id, user: users,});
          Log.create(log).then(datab => {
            sequencing(x, reqs, users, res);
          }).catch(err =>{console.error("wh0201",err);res.status(500).send({message:err}); });
        }).catch(err =>{console.error("wh0202",err);res.status(500).send({message:err}); });
      }
    });
  }else{
    if(duplicate.length>0) res.status(500).send(duplicate);
    else res.status(200).send({message:"Semua data telah diinput!"});
  }
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Warehouse.findAll({ include: [
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("wh0301",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Warehouse.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("wh0401",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Warehouse.findAll({where:condition, 
    include: [
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("wh0501",err);res.status(500).send({message:err}); });
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
  Warehouse.update(req.body, {where: {id:req.params.id}})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else {
        const log = ({message: req.body.message, warehouse: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("wh0601",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("wh0602",err);res.status(500).send({message:err}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Warehouse.findAll({where:{active: true}, 
    include: [
      {model: Company, as: "companys"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("wh0701",err);res.status(500).send({message:err}); });
};

exports.findMain = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Warehouse.findAll({where:{main: true},
    include: [
      {model: Company, as: "companys"},
    ] })
      .then(data => {
        res.send(data);
      }).catch(err =>{console.error("wh0801",err);res.status(500).send({message:err}); });
};