module.exports = (sequelize, Sequelize) => {
  const Tax = sequelize.define("taxs", {
    tax: {type: Sequelize.FLOAT},
    name: {type: Sequelize.STRING},
    include: {type: Sequelize.BOOLEAN},
    company: {type: Sequelize.INTEGER},
  });

  return Tax;
};