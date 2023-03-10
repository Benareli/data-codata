module.exports = (sequelize, Sequelize) => {
  const Bundle = sequelize.define("bundles", {
    bundle: {type: Sequelize.INTEGER},
    qty: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Bundle;
};