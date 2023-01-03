module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define("stores", {
    store_name: {type: Sequelize.STRING},
    store_addr: {type: Sequelize.TEXT},
    store_phone: {type: Sequelize.STRING},
    warehouse: {type: Sequelize.INTEGER},
    company: {type: Sequelize.INTEGER},
  });

  return Store;
};