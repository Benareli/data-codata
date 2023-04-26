module.exports = (sequelize, Sequelize) => {
    const Paymentmethod = sequelize.define("paymentmethods", {
        name: {type: Sequelize.STRING},
        active: {type: Sequelize.BOOLEAN},
    }, {underscored: true});
  
    return Paymentmethod;
  };