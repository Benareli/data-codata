module.exports = (sequelize, Sequelize) => {
  const Lot = sequelize.define("lots", {
    name: {type: Sequelize.STRING},
  }, {underscored: true});

  return Lot;
};