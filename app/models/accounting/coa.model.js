module.exports = (sequelize, Sequelize) => {
  const Coa = sequelize.define("coas", {
    prefix: {type: Sequelize.INTEGER},
    code: {type: Sequelize.STRING},
    name: {type: Sequelize.STRING},
    active: {type: Sequelize.BOOLEAN},
    company: {type: Sequelize.INTEGER},
  }, {underscored: true});

  return Coa;
};