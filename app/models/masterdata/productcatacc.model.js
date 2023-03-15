module.exports = (sequelize, Sequelize) => {
  const ProductCatAcc = sequelize.define("productcataccs", {
    auto: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return ProductCatAcc;
};