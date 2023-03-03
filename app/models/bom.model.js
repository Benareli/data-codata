module.exports = (sequelize, Sequelize) => {
  const Bom = sequelize.define("boms", {
    qty: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Bom;
};