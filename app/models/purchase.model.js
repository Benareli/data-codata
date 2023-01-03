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
    supplier: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
    user: {type: Sequelize.INTEGER},
    
    paid: {type: Sequelize.INTEGER}, //0 No, 1 Partial, 2 Complete
    open: {type: Sequelize.BOOLEAN},
    company: {type: Sequelize.INTEGER},
  });

  return Purchase;
};

/*purchase_detail:[
      {type: Sequelize.INTEGER},
    ],
    payment:[
      {type: Sequelize.INTEGER},
    ],*/