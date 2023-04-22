module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define("companys", {
    cost_general: {type: Sequelize.BOOLEAN},
    comp_name: {type: Sequelize.STRING},
    street: {type: Sequelize.STRING},
    street2: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    state: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING},
    zip: {type: Sequelize.STRING},
    comp_phone: {type: Sequelize.STRING},
    comp_email: {type: Sequelize.STRING},
    nav_color: {type: Sequelize.STRING},
    title_color: {type: Sequelize.STRING},
    image: {type: Sequelize.TEXT},
    restaurant: {type: Sequelize.BOOLEAN},
    pos_shift: {type: Sequelize.BOOLEAN},
    parent: {type: Sequelize.INTEGER},
  }, {underscored: true});

  return Company;
};