module.exports = (sequelize, Sequelize) => {
  const ProductCat = sequelize.define("productcats", {
    catid: {type: Sequelize.STRING},
    description: {type: Sequelize.STRING},
    active: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return ProductCat;
};