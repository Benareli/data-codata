module.exports = (sequelize, Sequelize) => {
  const Purchasedetail = sequelize.define("purchasedetail", {
    purchase_id: {type: Sequelize.INTEGER},
    qty: {type: Sequelize.FLOAT},
    qty_done: {type: Sequelize.FLOAT},
    qty_inv: {type: Sequelize.FLOAT},
    qty_rec: {type: Sequelize.FLOAT},
    price_unit: {type: Sequelize.FLOAT},
    discount: {type: Sequelize.FLOAT},
    tax: {type: Sequelize.FLOAT},
    subtotal: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
    product: {type: Sequelize.INTEGER},
    uom: {type: Sequelize.INTEGER},
    partner: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
    company: {type: Sequelize.INTEGER},
  });

  return Purchasedetail;
};

//stockmove: [{type: Sequelize.INTEGER},]