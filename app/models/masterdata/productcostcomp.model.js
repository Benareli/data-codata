module.exports = (sequelize, Sequelize) => {
  const ProductCostComp = sequelize.define("productcostcomps", {
    cost: {type: Sequelize.FLOAT},
    qoh: {type: Sequelize.FLOAT},
    min: {type: Sequelize.FLOAT},
    max: {type: Sequelize.FLOAT},
  }, {underscored: true});
  return ProductCostComp;
};

//qop:[{type: Sequelize.STRING}],