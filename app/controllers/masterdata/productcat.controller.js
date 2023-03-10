const db = require("../../models");
const { compare } = require('../../function/key.function');
const ProductCat = db.productcats;
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
  ProductCat.findAll({where:{description: req.body.description}}).then(find => {
    if(find.length > 0) res.status(500).send({ message: "Already Existed!" });
    else{
      const prodcat = ({catid: req.body.catid, description: req.body.description, 
        active: req.body.active ? req.body.active : false});
      ProductCat.create(prodcat).then(dataa => {
        const log = ({message: "dibuat", category: dataa.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("pcat0101",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("pcat0102",err.message);res.status(500).send({message:err.message}); });
    }
  }).catch(err =>{console.error("pcat0103",err.message);res.status(500).send({message:err.message}); });
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
    ProductCat.findAll({where:{description: reqs[x].nama}}).then(data => {
      if(data.length>0){
        duplicate.push(x+1);
        sequencing(x, reqs, users, res);
      }
      else{
        const prodcat = ({catid: reqs[x].id, description: reqs[x].nama, active: true});
        ProductCat.create(prodcat).then(dataa => {
          const log = ({message: "upload", category: dataa.id, user: users,});
          Log.create(log).then(datab => {
            sequencing(x, reqs, users, res);
          }).catch(err =>{console.error("pcat0201",err.message);res.status(500).send({message:err.message}); });
        }).catch(err =>{console.error("pcat0202",err.message);res.status(500).send({message:err.message}); });
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
  ProductCat.findAll()
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pcat0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCat.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("pcat0401",err.message);res.status(500).send({message:err.message}); });
};

exports.findByDesc = (req, res) => {
  const description = req.query.description;
  var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCat.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pcat0501",err.message);res.status(500).send({message:err.message}); });
};

exports.findByCatId = (req, res) => {
  const catid = req.query.catid;
  var condition = catid ? { catid: { $regex: new RegExp(catid), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCat.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pcat0601",err.message);res.status(500).send({message:err.message}); });
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
  ProductCat.findAll({where:{description: req.body.description}}).then(find => {
    if(find.length > 0 && find[0].id != req.params.id) res.status(500).send({ message: "Already Existed!" });
    else{
      ProductCat.update(req.body, {where:{id:req.params.id}})
        .then(data => {
          if (!data) {
            res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
          } else {
            const log = ({message: req.body.message, category: req.params.id, user: req.body.user,});
            Log.create(log).then(datab => {
              res.send({ message: "Updated successfully." });
            }).catch(err =>{console.error("pcat0701",err.message);res.status(500).send({message:err.message}); });
          };
        }).catch(err =>{console.error("pcat0702",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("pcat0703",err.message);res.status(500).send({message:err.message}); });
};

exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCat.findByIdAndRemove(req.params.id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({message: "Deleted successfully!"});
      }
    }).catch(err =>{console.error("pcat0801",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCat.findAll({where:{ active: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pcat0901",err.message);res.status(500).send({message:err.message}); });
};