const db = require("../../models");
const { compare } = require('../../function/key.function');
const Brand = db.brands;
const Log = db.logs;
const User = db.users;
const duplicate = [];

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  Brand.findAll({where:{description: req.body.description}}).then(find => {
    if(find.length > 0) res.status(500).send({ message: "Already Existed!" });
    else{
      const brand = ({description: req.body.description, active: req.body.active ? req.body.active : false});
      Brand.create(brand).then(dataa => {
        const log = ({message: "dibuat", brand: dataa.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("br0101",err);res.status(500).send({message:err}); });
      }).catch(err =>{console.error("br0102",err);res.status(500).send({message:err}); });
    }
  }).catch(err =>{console.error("br0103",err);res.status(500).send({message:err}); });
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
    Brand.findAll({where:{description: reqs[x].nama}}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        const brand = ({description: reqs[x].nama, active: true});
        Brand.create(brand).then(dataa => {
          const log = ({message: "upload", brand: dataa._id, user: users,});
          Log.create(log).then(datab => {
            sequencing(x, reqs, users, res);
          }).catch(err =>{console.error("br0201",err);res.status(500).send({message:err}); });
        }).catch(err =>{console.error("br0202",err);res.status(500).send({message:err}); });
      }
    });
  }else{
    if(duplicate.length>0){res.status(500).send(duplicate);duplicate.splice(0,duplicate.length);}
    else res.status(200).send({message:"Semua data telah diinput!"});
  }
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

exports.findAll = (req, res) => {
  const description = req.query.description;
  var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

  Brand.findAll({where: condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("br0301",err);res.status(500).send({message:err}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Brand.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("br0401",err);res.status(500).send({message:err}); });
};

exports.findByDesc = (req, res) => {
  const description = req.query.description;
  var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Brand.findOne({where: condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("br0501",err);res.status(500).send({message:err}); });
};

exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }

  Brand.findAll({where:{description: req.body.description}}).then(find => {
    if(find.length > 0 && find[0].id != req.params.id) res.status(500).send({ message: "Already Existed!" });
    else{
      Brand.update(({description: req.body.description, 
        active: req.body.active ? req.body.active : false}), 
        {where:{id:req.params.id}})
        .then(data => {
          if (!data) {
            res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
          } else{
            const log = ({message: req.body.message, brand: req.params.id, user: req.body.user,});
            Log.create(log).then(datab => {
              res.send({ message: "Updated successfully." });
            }).catch(err =>{console.error("br0601",err);res.status(500).send({message:err}); });
          } 
        }).catch(err =>{console.error("br0602",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("br0603",err);res.status(500).send({message:err}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Brand.findAll({where:{active: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("br0701",err);res.status(500).send({message:err}); });
};