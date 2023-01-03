module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payments", {
    pay_id: {type: Sequelize.STRING},
    order_id: {type: Sequelize.STRING},
    amount_total: {type: Sequelize.FLOAT},
    payment1: {type: Sequelize.FLOAT},
    pay1method: {type: Sequelize.STRING},
    pay1note: {type: Sequelize.STRING},
    payment2: {type: Sequelize.FLOAT},
    pay2method: {type: Sequelize.STRING},
    pay2note: {type: Sequelize.STRING},
    change: {type: Sequelize.FLOAT},
    changeMethod: {type: Sequelize.STRING},
    date: {type: 'TIMESTAMP'},
    type: {type: Sequelize.INTEGER}, //0 - in, 1 - out
    company: {type: Sequelize.INTEGER},
  });

  return Payment;
};