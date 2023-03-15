module.exports = (sequelize, Sequelize) => {
  const Stockrequest = sequelize.define("stockrequests", {
    trans_id: {type: Sequelize.STRING},
    qty_rec: {type: Sequelize.FLOAT},
    cost: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    origin: {type: Sequelize.STRING},
    req: {type: Sequelize.BOOLEAN},
    type: {type: Sequelize.STRING},
  }, {underscored: true});

  return Stockrequest;
};