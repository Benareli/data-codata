module.exports = (sequelize, Sequelize) => {
  const Qof = sequelize.define("qofs", {
    qof: {type: Sequelize.FLOAT},
    uom: {type: Sequelize.INTEGER},
    product: {type: Sequelize.INTEGER},
    partner: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
  });

  return Qof;
};