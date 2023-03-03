module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define("stores", {
    store_name: {type: Sequelize.STRING},
    store_addr: {type: Sequelize.TEXT},
    store_phone: {type: Sequelize.STRING},
  }, {underscored: true});

  return Store;
};