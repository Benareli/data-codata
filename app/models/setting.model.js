module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("settings", {
    cost_general: {type: Sequelize.BOOLEAN},
    comp_name: {type: Sequelize.STRING},
    comp_addr: {type: Sequelize.TEXT},
    comp_phone: {type: Sequelize.STRING},
    comp_email: {type: Sequelize.STRING},
    nav_color: {type: Sequelize.STRING},
    title_color: {type: Sequelize.STRING},
    image: {type: Sequelize.TEXT},
    restaurant: {type: Sequelize.BOOLEAN},
    pos_shift: {type: Sequelize.BOOLEAN},
    parent: {type: Sequelize.INTEGER},
  });

  return Setting;
};