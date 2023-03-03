module.exports = (sequelize, Sequelize) => {
  const Entry = sequelize.define("entrys", {
    debit: {type: Sequelize.FLOAT},
    credit: {type: Sequelize.FLOAT},
    label: {type: Sequelize.STRING},
    product: {type: Sequelize.INTEGER},
    qty: {type: Sequelize.FLOAT},
    uom: {type: Sequelize.INTEGER},
    price_unit: {type: Sequelize.FLOAT},
    tax: {type: Sequelize.FLOAT},
    discount: {type: Sequelize.FLOAT},
    subtotal: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
  }, {underscored: true});

  return Entry;
};