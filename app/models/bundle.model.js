module.exports = (sequelize, Sequelize) => {
  const Bundle = sequelize.define("bundles", {
    bundle: {type: Sequelize.INTEGER},
    qty: {type: Sequelize.FLOAT},
    uom: {type: Sequelize.INTEGER},
    product: {type: Sequelize.INTEGER},
  });

  return Bundle;
};