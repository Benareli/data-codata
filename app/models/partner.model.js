module.exports = (sequelize, Sequelize) => {
  const Partner = sequelize.define("partners", {
    code: {type: Sequelize.STRING},
    name: {type: Sequelize.TEXT},
    phone: {type: Sequelize.STRING},
    isCustomer: {type: Sequelize.BOOLEAN},
    isSupplier: {type: Sequelize.BOOLEAN},
    active: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Partner;
};