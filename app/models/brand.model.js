module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("brands", {
    description: {type: Sequelize.STRING},
    active: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Brand;
};