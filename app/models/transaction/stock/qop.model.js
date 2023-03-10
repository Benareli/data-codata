module.exports = (sequelize, Sequelize) => {
  const Qop = sequelize.define("qops", {
    qop: {type: Sequelize.FLOAT},
    cost: {type: Sequelize.FLOAT},
  }, {underscored: true});

  return Qop;
};