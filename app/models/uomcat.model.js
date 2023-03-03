module.exports = (sequelize, Sequelize) => {
  const Uomcat = sequelize.define("uomcats", {
    uom_cat: {type: Sequelize.STRING},
  }, {underscored: true});
  
  return Uomcat;
};