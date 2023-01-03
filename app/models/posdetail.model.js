module.exports = (sequelize, Sequelize) => {
  const Posdetail = sequelize.define("posdetails", {
    order_id: {type: Sequelize.STRING},
    qty: {type: Sequelize.FLOAT},
    uom: {type: Sequelize.INTEGER},
    price_unit: {type: Sequelize.FLOAT},
    discount: {type: Sequelize.FLOAT},
    tax: {type: Sequelize.FLOAT},
    include: {type: Sequelize.BOOLEAN},
    subtotal: {type: Sequelize.FLOAT},
    product: {type: Sequelize.INTEGER},
    store: {type: Sequelize.INTEGER},
    warehouse: {type: Sequelize.INTEGER},
    date: {type: 'TIMESTAMP'},
    company: {type: Sequelize.INTEGER},
  });

  return Posdetail;
};