module.exports = (sequelize, Sequelize) => {
  const Pos = sequelize.define("pos", {
    order_id: {type: Sequelize.STRING},
    date: {type: 'TIMESTAMP'},
    disc_type: {type: Sequelize.STRING},
    discount: {type: Sequelize.FLOAT},
    amount_subtotal: {type: Sequelize.FLOAT},
    amount_untaxed: {type: Sequelize.FLOAT},
    amount_tax: {type: Sequelize.FLOAT},
    amount_total: {type: Sequelize.FLOAT},
    open: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Pos;
};

/*
  pos_detail:[
      {type: Sequelize.INTEGER},
    ],
    payment:[
      {type: Sequelize.INTEGER},
    ],
    */