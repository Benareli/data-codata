module.exports = (sequelize, Sequelize) => {
  const Stockmove = sequelize.define("stockmoves", {
    trans_id: {type: Sequelize.STRING},
    qin: {type: Sequelize.FLOAT},
    qout: {type: Sequelize.FLOAT},
    cost: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    origin: {type: Sequelize.STRING},
    uom: {type: Sequelize.INTEGER},
    user: {type: Sequelize.INTEGER},
    product: {type: Sequelize.INTEGER},
    partner: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
    company: {type: Sequelize.INTEGER},
  });

  return Stockmove;
};