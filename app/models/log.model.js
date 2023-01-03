module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("logs", {
    message: {type: Sequelize.TEXT},
    category: {type: Sequelize.STRING},
    brand: {type: Sequelize.STRING},
    product: {type: Sequelize.STRING},
    uom_cat: {type: Sequelize.STRING},
    uom: {type: Sequelize.STRING},
    partner: {type: Sequelize.STRING},
    warehouse: {type: Sequelize.STRING},
    store: {type: Sequelize.STRING},
    pos: {type: Sequelize.STRING},
    purchase: {type: Sequelize.STRING},
    sale: {type: Sequelize.STRING},
    journal: {type: Sequelize.STRING},
    ticket: {type: Sequelize.STRING},
    user: {type: Sequelize.STRING},
  });

  return Log;
};