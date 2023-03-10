module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    name: {type: Sequelize.STRING}
  }, {underscored: true});

  return Role;
};