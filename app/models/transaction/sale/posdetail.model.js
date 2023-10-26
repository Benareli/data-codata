module.exports = (sequelize, Sequelize) => {
  const Posdetail = sequelize.define("posdetails", {
    order_id: {type: Sequelize.STRING},
    qty: {type: Sequelize.FLOAT},
    price_unit: {type: Sequelize.FLOAT},
    discount: {type: Sequelize.FLOAT},
    tax: {type: Sequelize.FLOAT},
    include: {type: Sequelize.BOOLEAN},
    subtotal: {type: Sequelize.FLOAT},
    date: {type: 'TIMESTAMP'},
  }, {underscored: true});

  return Posdetail;
};