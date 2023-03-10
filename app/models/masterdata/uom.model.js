module.exports = (sequelize, Sequelize) => {
  const Uom = sequelize.define("uoms", {
    uom_name: {type: Sequelize.STRING},
    ratio: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Uom;
};