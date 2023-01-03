module.exports = (sequelize, Sequelize) => {
  const Costing = sequelize.define("costings", {
    product: {type: Sequelize.INTEGER},
    overhead: {type: Sequelize.FLOAT},
    ovType: {type: Sequelize.STRING},
    ovTime: {type: Sequelize.FLOAT},
    labor: {type: Sequelize.FLOAT},
    laType: {type: Sequelize.STRING},
    laTime: {type: Sequelize.FLOAT},
  });

  return Costing;
};