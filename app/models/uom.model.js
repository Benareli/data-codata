module.exports = (sequelize, Sequelize) => {
  const Uom = sequelize.define("uoms", {
    uom_name: {type: Sequelize.STRING},
    uom_cat: {type: Sequelize.INTEGER},
  });

  return Uom;
};