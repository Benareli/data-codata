module.exports = (sequelize, Sequelize) => {
  const Qop = sequelize.define("qops", {
    qop: {type: Sequelize.FLOAT},
    uom: {type: Sequelize.INTEGER},
    product: {type: Sequelize.INTEGER},
    partner: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
    cost: {type: Sequelize.FLOAT},
  });

  return Qop;
};