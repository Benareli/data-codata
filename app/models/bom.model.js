module.exports = (sequelize, Sequelize) => {
  const Bom = sequelize.define("boms", {
    qty: {type: Sequelize.FLOAT},
    uom: {type: Sequelize.INTEGER},
    product: {type: Sequelize.INTEGER},
    bom: {type: Sequelize.INTEGER},
    company: {type: Sequelize.INTEGER},
  });

  return Bom;
};