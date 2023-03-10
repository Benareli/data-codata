module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payments", {
    pay_id: {type: Sequelize.STRING},
    order_id: {type: Sequelize.STRING},
    amount_total: {type: Sequelize.FLOAT},
    payment: {type: Sequelize.FLOAT},
    pay_method: {type: Sequelize.STRING},
    pay_note: {type: Sequelize.STRING},
    change: {type: Sequelize.FLOAT},
    change_method: {type: Sequelize.STRING},
    date: {type: 'TIMESTAMP'},
    type: {type: Sequelize.INTEGER}, //0 - in, 1 - out
  }, {underscored: true});

  return Payment;
};