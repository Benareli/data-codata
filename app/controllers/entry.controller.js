const db = require("../models");
const { compare } = require('../function/key.function');
const Journal = db.journals;
const Entry = db.entrys;
const User = db.users;
const Coa = db.coas;
const Id = db.ids;
var journid, journalid, journalcount;

exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Entry.findAll({ include: [
      {model: Coa, as: "debits"},
      {model: Coa, as: "credits"},
    ] })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("ent0101",err.message);res.status(500).send({message:err.message}); });  
};

exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Entry.findByPk(req.params.id, { include: [
      {model: Coa, as: "debits"},
      {model: Coa, as: "credits"},
    ] })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("ent0201",err.message);res.status(500).send({message:err.message}); });
};

exports.findByJournal = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  /*Entry.findAll({where:{journal_id: req.params.journal},
    include: [
      {model: Coa, as: "debits"},
      {model: Coa, as: "credits"},
    ] })*/
  db.sequelize.query
    ('SELECT public.entrys.* FROM public.journal_entry ' +
      'LEFT JOIN public.entrys ON public.journal_entry.entry_id = public.entrys.id ' +
      'WHERE public.journal_entry.journal_id = ' + req.params.journal
      ,{raw: true, nest: true})
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("ent0301",err.message);res.status(500).send({message:err.message}); });
};