module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("logs", {
    message: {type: Sequelize.TEXT},
    category: {type: Sequelize.INTEGER},
    brand: {type: Sequelize.INTEGER},
    product: {type: Sequelize.INTEGER},
    uom_cat: {type: Sequelize.INTEGER},
    uom: {type: Sequelize.INTEGER},
    partner: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
    store: {type: Sequelize.INTEGER},
    pos: {type: Sequelize.INTEGER},
    purchase: {type: Sequelize.INTEGER},
    sale: {type: Sequelize.INTEGER},
    journal: {type: Sequelize.INTEGER},
    ticket: {type: Sequelize.INTEGER},
    user: {type: Sequelize.INTEGER},
  }, {underscored: true});

  return Log;
};