module.exports = (sequelize, Sequelize) => {
  const Partner = sequelize.define("partners", {
    code: {type: Sequelize.STRING},
    name: {type: Sequelize.TEXT},
    street: {type: Sequelize.STRING},
    street2: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    state: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING},
    zip: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING},
    phone: {type: Sequelize.STRING},
    isCustomer: {type: Sequelize.BOOLEAN},
    isSupplier: {type: Sequelize.BOOLEAN},
    active: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Partner;
};