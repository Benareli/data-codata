module.exports = (sequelize, Sequelize) => {
  const Purchasedetail = sequelize.define("purchasedetail", {
    qty: {type: Sequelize.FLOAT},
    qty_done: {type: Sequelize.FLOAT},
    qty_inv: {type: Sequelize.FLOAT},
    qty_rec: {type: Sequelize.FLOAT},
    price_unit: {type: Sequelize.FLOAT},
    discount: {type: Sequelize.FLOAT},
    tax: {type: Sequelize.FLOAT},
    subtotal: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
  }, {underscored: true});

  return Purchasedetail;
};