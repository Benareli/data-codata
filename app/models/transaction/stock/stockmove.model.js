module.exports = (sequelize, Sequelize) => {
  const Stockmove = sequelize.define("stockmoves", {
    trans_id: {type: Sequelize.STRING},
    qin: {type: Sequelize.FLOAT},
    qout: {type: Sequelize.FLOAT},
    cost: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    origin: {type: Sequelize.STRING},
    oriqin: {type: Sequelize.FLOAT},
    oriqout: {type: Sequelize.FLOAT},
    oricost: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Stockmove;
};