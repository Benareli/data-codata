module.exports = (sequelize, Sequelize) => {
  const Coa = sequelize.define("coas", {
    prefix: {type: Sequelize.INTEGER},
    code: {type: Sequelize.STRING},
    name: {type: Sequelize.STRING},
    active: {type: Sequelize.BOOLEAN},
    type: {type: Sequelize.INTEGER}, // 0 - General, 1 - Payment, 2 - Receivable, 3 - Payable
  }, {underscored: true});

  return Coa;
};