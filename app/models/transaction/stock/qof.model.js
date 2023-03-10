module.exports = (sequelize, Sequelize) => {
  const Qof = sequelize.define("qofs", {
    qof: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Qof;
};