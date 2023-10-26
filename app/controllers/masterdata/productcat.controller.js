const db = require("../../models");
const { compare } = require('../../function/key.function');
const ProductCat = db.productcats;
const ProductCatAcc = db.productcataccs;
const Log = db.logs;
const User = db.users;
const Coa = db.coas;
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
        }).catch(err =>{console.error("pcat0101",err);res.status(500).send({message:err}); });
      }).catch(err =>{console.error("pcat0102",err);res.status(500).send({message:err}); });
    }
  }).catch(err =>{console.error("pcat0103",err);res.status(500).send({message:err}); });
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
          }).catch(err =>{console.error("pcat0201",err);res.status(500).send({message:err}); });
        }).catch(err =>{console.error("pcat0202",err);res.status(500).send({message:err}); });
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
    }).catch(err =>{console.error("pcat0301",err);res.status(500).send({message:err}); });
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
    }).catch(err =>{console.error("pcat0401",err);res.status(500).send({message:err}); });
};

exports.findOneAcc = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  /*{ include: [
      {model: Coa, as: "revenues"},
      {model: Coa, as: "costs"},
      {model: Coa, as: "incomings"},
      {model: Coa, as: "outgoings"},
    ], raw: true, nest: true}*/
  ProductCat.findByPk(req.params.id)
    .then(data => {
      ProductCatAcc.findOne({where:{category_id: req.params.id, company_id: req.params.company}, include: [
      {model: Coa, as: "revenues"},
      {model: Coa, as: "costs"},
      {model: Coa, as: "incomings"},
      {model: Coa, as: "outgoings"},
      {model: Coa, as: "inventorys"},
    ], raw: true, nest: true})
        .then(dataa => {
          if (!dataa)
            res.status(404).send({ message: "Not found Data with id " + id });
          else res.send(dataa);
      }).catch(err =>{console.error("pcat0402",err);res.status(500).send({message:err}); });
    }).catch(err =>{console.error("pcat0403",err);res.status(500).send({message:err}); });
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
    }).catch(err =>{console.error("pcat0501",err);res.status(500).send({message:err}); });
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
    }).catch(err =>{console.error("pcat0601",err);res.status(500).send({message:err}); });
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
            ProductCatAcc.update(
              {
                revenue_id: req.body.revenue_id,
                cost_id: req.body.cost_id,
                incoming_id: req.body.incoming_id,
                outgoing_id: req.body.outgoing_id,
                inventory_id: req.body.inventory_id,
              },
              {where:{category_id: req.params.id, company_id: req.body.company}}).then(pdcc => {
              const log = ({message: req.body.message, category: req.params.id, user: req.body.user,});
              Log.create(log).then(datab => {
                res.send({ message: "Updated successfully." });
              }).catch(err =>{console.error("pcat0700",err);res.status(500).send({message:err}); });
            }).catch(err =>{console.error("pcat0701",err);res.status(500).send({message:err}); });
          };
        }).catch(err =>{console.error("pcat0702",err);res.status(500).send({message:err}); });
      }
    }).catch(err =>{console.error("pcat0703",err);res.status(500).send({message:err}); });
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
    }).catch(err =>{console.error("pcat0801",err);res.status(500).send({message:err}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  ProductCat.findAll({where:{ active: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("pcat0901",err);res.status(500).send({message:err}); });
};