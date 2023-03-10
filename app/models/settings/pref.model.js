module.exports = (sequelize, Sequelize) => {
  const Pref = sequelize.define("prefs", {
    user_id: {type: Sequelize.STRING},
    pos_qty: {type: Sequelize.BOOLEAN},
    pos_image: {type: Sequelize.BOOLEAN},
  }, {underscored: true});

  return Pref;
};