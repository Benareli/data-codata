module.exports = (sequelize, Sequelize) => {
  const Id = sequelize.define("ids", {
    pos_id: {type: Sequelize.INTEGER},
    pre_pos_id: {type: Sequelize.STRING},
    pos_session: {type: Sequelize.INTEGER},
    pre_pos_session: {type: Sequelize.STRING},
    transfer_id: {type: Sequelize.INTEGER},
    pre_transfer_id: {type: Sequelize.STRING},
    pay_id: {type: Sequelize.INTEGER},
    pre_pay_id: {type: Sequelize.STRING},
    journal_id: {type: Sequelize.INTEGER},
    pre_journal_id: {type: Sequelize.STRING},
    purchase_id: {type: Sequelize.INTEGER},
    pre_purchase_id: {type: Sequelize.STRING},
    sale_id: {type: Sequelize.INTEGER},
    pre_sale_id: {type: Sequelize.STRING},
    bill_id: {type: Sequelize.INTEGER},
    pre_bill_id: {type: Sequelize.STRING},
    invoice_id: {type: Sequelize.INTEGER},
    pre_invoice_id: {type: Sequelize.STRING},
    ticket_id: {type: Sequelize.INTEGER},
    pre_ticket_id: {type: Sequelize.STRING},
    company: {type: Sequelize.INTEGER},
  });

  return Id;
};