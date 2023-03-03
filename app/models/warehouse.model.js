module.exports = (sequelize, Sequelize) => {
  const Warehouse = sequelize.define("warehouses", {
    name: {type: Sequelize.STRING},
    short: {type: Sequelize.STRING},
    main: {type: Sequelize.BOOLEAN},
    active: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Warehouse;
};