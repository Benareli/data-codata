/*const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Role;*/

module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    name: {type: Sequelize.STRING}
  }, {underscored: true});

  return Role;
};