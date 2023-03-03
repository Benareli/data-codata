const db = require("../models");
const { compare } = require('../function/key.function');
const Partner = db.partners;
const Log = db.logs;
const User = db.users;

exports.create = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  Partner.findAll({where:{name: req.body.name}}).then(find => {
    if(find.length > 0) res.status(500).send({ message: "Already Existed!" });
    else{
      const partner = ({
        code: req.body.code, name: req.body.name, phone: req.body.phone, isCustomer: req.body.isCustomer ? req.body.isCustomer : false,
        isSupplier: req.body.isSupplier ? req.body.isSupplier : false, active: req.body.active ? req.body.active : false
      });
      Partner.create(partner).then(dataa => {
        const log = ({message: "dibuat", partner: dataa.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(datab);
        }).catch(err =>{console.error("par0101",err.message);res.status(500).send({message:err.message}); });
      }).catch(err =>{console.error("par0102",err.message);res.status(500).send({message:err.message}); });
    }
  }).catch(err =>{console.error("par0103",err.message);res.status(500).send({message:err.message}); });
};

exports.createMany = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }else{startSequence(0, req.body, req.query.user, res);}
};

function startSequence(x, reqs, users, res){
  if(reqs[x]){
    Partner.find({name: reqs[x].nama}).then(data => {
      if(data.length>0){}
      else{
        if((reqs[x].pelanggan=="ya"||reqs[x].pelanggan=="Ya"||reqs[x].pelanggan=="YA")
          &&(reqs[x].supplier=="ya"||reqs[x].supplier=="Ya"||reqs[x].supplier=="YA")){
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: true,isSupplier: true,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);
            }).catch(err =>{console.error("par0201",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("par0202",err.message);res.status(500).send({message:err.message}); });
        }else if((reqs[x].pelanggan!="ya"||reqs[x].pelanggan!="Ya"||reqs[x].pelanggan!="YA")
          &&(reqs[x].supplier=="ya"||reqs[x].supplier=="Ya"||reqs[x].supplier=="YA")){
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: false,isSupplier: true,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);
            }).catch(err =>{console.error("par0203",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("par0204",err.message);res.status(500).send({message:err.message}); });
        }else if((reqs[x].pelanggan=="ya"||reqs[x].pelanggan=="Ya"||reqs[x].pelanggan=="YA")
          &&(reqs[x].supplier!="ya"||reqs[x].supplier!="Ya"||reqs[x].supplier!="YA")){
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: true,isSupplier: false,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);
            }).catch(err =>{console.error("par0205",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("par0206",err.message);res.status(500).send({message:err.message}); });
        }else{
          const partner = ({code: reqs[x].kode,name: reqs[x].nama,phone: reqs[x].phone,
            isCustomer: false,isSupplier: false,active: true});
          Partner.create(partner).then(dataa => {
            const log = ({message: "upload", partner: dataa._id, user: users,});
            Log.create(log).then(datab => {
              sequencing(x, reqs, users, res);
            }).catch(err =>{console.error("par0207",err.message);res.status(500).send({message:err.message}); });
          }).catch(err =>{console.error("par0208",err.message);res.status(500).send({message:err.message}); });
        }
      }
    });
  }else{res.send({message:"Semua data telah diinput!"})}
}

function sequencing(x, reqs, users, res){
  x=x+1;
  startSequence(x, reqs, users, res);
}

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par0301",err.message);res.status(500).send({message:err.message}); });
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findByPk(req.params.id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("par0401",err.message);res.status(500).send({message:err.message}); });
};

exports.findByDesc = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:condition})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par0501",err.message);res.status(500).send({message:err.message}); });
};

exports.update = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    return res.status(400).send({message: "Data to update can not be empty!"});
  }

  Partner.findAll({where:{name: req.body.name}}).then(find => {
    if(find.length > 0 && find[0].id != req.params.id) res.status(500).send({ message: "Already Existed!" });
    else{
      Partner.update(req.body, {where:{id:req.params.id}})
        .then(data => {
          if (!data) {
            res.status(404).send({message: `Cannot update. Maybe Data was not found!`});
          } else {
            const log = ({message: req.body.message, partner: req.params.id, user: req.body.user,});
            Log.create(log).then(datab => {
              res.send({ message: "Updated successfully." });
            }).catch(err =>{console.error("par0601",err.message);res.status(500).send({message:err.message}); });
          }
        }).catch(err =>{console.error("par0602",err.message);res.status(500).send({message:err.message}); });
      }
    }).catch(err =>{console.error("par0603",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllActive = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:{ active: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par0701",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllCustomer = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:{ isCustomer: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par0801",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllSupplier = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:{ isSupplier: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par0901",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllActiveCustomer = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:{ active: true, isCustomer: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par1001",err.message);res.status(500).send({message:err.message}); });
};

exports.findAllActiveSupplier = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Partner.findAll({where:{ active: true, isSupplier: true }})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("par1101",err.message);res.status(500).send({message:err.message}); });
};