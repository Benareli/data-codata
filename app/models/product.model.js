module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    sku: {type: Sequelize.STRING},
    name: {type: Sequelize.TEXT},
    description: {type: Sequelize.TEXT},
    barcode: {type: Sequelize.STRING},
    fg: {type: Sequelize.BOOLEAN},
    rm: {type: Sequelize.BOOLEAN},
    listprice: {type: Sequelize.FLOAT},
    botprice: {type: Sequelize.FLOAT},
    cost: {type: Sequelize.FLOAT},
    min: {type: Sequelize.FLOAT},
    max: {type: Sequelize.FLOAT},
    isStock: {type: Sequelize.BOOLEAN},
    qoh: {type: Sequelize.FLOAT},
    image: {type: Sequelize.STRING},
    supplier: {type: Sequelize.INTEGER},
    active: {type: Sequelize.BOOLEAN}
  }, {underscored: true});

  return Product;
};

//qop:[{type: Sequelize.STRING}],