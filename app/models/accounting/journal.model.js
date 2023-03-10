module.exports = (sequelize, Sequelize) => {
  const Journal = sequelize.define("journals", {
    name: {type: Sequelize.STRING},
    amount: {type: Sequelize.FLOAT},
    amountdue: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    duedate: {type: 'TIMESTAMP'},
    state: {type: Sequelize.INTEGER}, //0 - Unpaid, 1 - Partial, 2 - Full Paid
    lock: {type: Sequelize.BOOLEAN},
    type: {type: Sequelize.STRING}, //miscellaneous, invoice, bill, payment, stock, pos
    origin: {type: Sequelize.STRING},
  }, {underscored: true});

  return Journal;
};