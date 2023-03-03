module.exports = (sequelize, Sequelize) => {
  const Stockrequest = sequelize.define("stockrequests", {
    trans_id: {type: Sequelize.STRING},
    qin: {type: Sequelize.FLOAT},
    qout: {type: Sequelize.FLOAT},
    cost: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    origin: {type: Sequelize.STRING},
    req: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Stockrequest;
};