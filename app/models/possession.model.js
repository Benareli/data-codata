module.exports = (sequelize, Sequelize) => {
  const Possession = sequelize.define("possessions", {
    session_id: {type: Sequelize.STRING},
    store: {type: Sequelize.INTEGER},
    time_open: {type: 'TIMESTAMP'},
    time_close: {type: 'TIMESTAMP'},
    shift: {type: Sequelize.INTEGER},
    user: {type: Sequelize.INTEGER},
    start_balance: {type: Sequelize.FLOAT},
    end_balance: {type: Sequelize.FLOAT},
    money_in: {type: Sequelize.FLOAT},
    money_out: {type: Sequelize.FLOAT},
    total_discount: {type: Sequelize.FLOAT},
    total_amount_untaxed: {type: Sequelize.FLOAT},
    total_amount_tax: {type: Sequelize.FLOAT},
    total_amount_total: {type: Sequelize.FLOAT},
    open: {type: Sequelize.BOOLEAN},
    company: {type: Sequelize.INTEGER},
  });

  return Possession;
};

/*
pos:[
      {type: Sequelize.INTEGER},
    ],
    payment:[
      {type: Sequelize.INTEGER},
    ],
    */