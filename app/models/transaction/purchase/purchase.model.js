module.exports = (sequelize, Sequelize) => {
  const Purchase = sequelize.define("purchases", {
    purchase_id: {type: Sequelize.STRING},
    date: {type: 'TIMESTAMP'},
    expected: {type: 'TIMESTAMP'},
    disc_type: {type: Sequelize.STRING},
    discount: {type: Sequelize.FLOAT},
    amount_untaxed: {type: Sequelize.FLOAT},
    amount_tax: {type: Sequelize.FLOAT},
    amount_total: {type: Sequelize.FLOAT},
    delivery_state: {type: Sequelize.INTEGER}, //0 No, 1 Partial, 2 Complete
    paid: {type: Sequelize.INTEGER}, //0 No, 1 Partial, 2 Complete
    open: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Purchase;
};