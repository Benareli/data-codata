module.exports = (sequelize, Sequelize) => {
  const Costing = sequelize.define("costings", {
    overhead: {type: Sequelize.FLOAT},
    ovType: {type: Sequelize.STRING},
    ovTime: {type: Sequelize.FLOAT},
    labor: {type: Sequelize.FLOAT},
    laType: {type: Sequelize.STRING},
    laTime: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Costing;
};