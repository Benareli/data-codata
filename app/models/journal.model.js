module.exports = (sequelize, Sequelize) => {
  const Journal = sequelize.define("journals", {
    journal_id: {type: Sequelize.STRING},
    amount: {type: Sequelize.FLOAT},
    payments: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    duedate: {type: 'TIMESTAMP'},
    state: {type: Sequelize.INTEGER}, //0 - Unpaid, 1 - Partial, 2 - Full Paid
    lock: {type: Sequelize.BOOLEAN},
    type: {type: Sequelize.STRING}, //journal, invoice, bill, payment, transfer, pos
    origin: {type: Sequelize.STRING},
    partner: {type: Sequelize.INTEGER},
    company: {type: Sequelize.INTEGER},
  });

  return Journal;
};

/*
entries:[
      {type: Sequelize.INTEGER},
    ],
    payment:[
      {type: Sequelize.INTEGER},
    ],
    */