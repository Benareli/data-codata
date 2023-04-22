module.exports = (sequelize, Sequelize) => {
  const Print = sequelize.define("prints", {
    module: {type: Sequelize.STRING},
    template: {type: Sequelize.TEXT},
  }, {underscored: true});

  return Print;
};