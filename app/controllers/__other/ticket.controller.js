const db = require("../models");
const { compare } = require('../function/key.function');
const {id,coa} = require("../function");
const Ticket = db.tickets;
const User = db.users;
const Log = db.logs;
var ticketid;

async function getUpdateTicketId() {
  const res1 = await id.getUpdateTicketId();
  return res1;
}

// Create and Save new
exports.create = (req, res) => {
  // Validate request
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  getUpdateTicketId().then(dataid => {
    ticketid = dataid;
    const ticket = ({
      ticketid: ticketid,
      fullname: req.body.fullname,
      message: req.body.message,
      phone: req.body.phone,
      email: req.body.email,
      date_submitted: req.body.date_submitted,
      date_expected: req.body.date_expected,
      stage: 0, //0 Open, 1 Handle, 2 Pending, 3 Done
      asignee: req.body.asignee,
    });
    Ticket.create(ticket).then(dataa => {
      const log = ({message: "created", ticket: dataa._id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send(dataa);
      }).catch(err =>{console.error("tick0101",err);res.status(500).send({message:err}); });
    }).catch(err =>{console.error("tick0102",err);res.status(500).send({message:err}); });
  }).catch(err =>{console.error("tick0103",err);res.status(500).send({message:err}); });
};

// Retrieve all from the database.
exports.findAll = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Ticket.find()
    .populate({ path: 'asignee', model: User })
    .then(data => {
      res.send(data);
    }).catch(err =>{console.error("tick0201",err);res.status(500).send({message:err}); });
};

// Find a single with an id
exports.findOne = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Ticket.findById(req.params.id)
    .populate({ path: 'asignee', model: User })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Data with id " + id });
      else res.send(data);
    }).catch(err =>{console.error("tick0301",err);res.status(500).send({message:err}); });
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
  Ticket.findByIdAndUpdate(req.params.id, ({
    ticketid: req.body.ticketid,
    fullname: req.body.fullname,
    message: req.body.message,
    phone: req.body.phone,
    email: req.body.email,
    date_submitted: req.body.date_submitted,
    date_expected: req.body.date_expected,
    stage: req.body.stage, //0 Open, 1 Handle, 2 Pending, 3 Done
    asignee: req.body.asignee,
  }), { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update with id=${id}. Maybe Data was not found!`
        });
      } else{
        const log = ({message: req.body.logmess, ticket: req.params.id, user: req.body.user,});
        Log.create(log).then(datab => {
          res.send({ message: "Updated successfully." });
        }).catch(err =>{console.error("tick0401",err);res.status(500).send({message:err}); });
      } 
    }).catch(err =>{console.error("tick0402",err);res.status(500).send({message:err}); });
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
  if(!req.headers.apikey || compare(req, res)==0) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }
  Ticket.findByIdAndRemove(req.params.id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete with id=${id}. Maybe Data was not found!`
        });
      } else {
        res.send({
          message: "Deleted successfully!"
        });
      }
    }).catch(err =>{console.error("tick0501",err);res.status(500).send({message:err}); });
};