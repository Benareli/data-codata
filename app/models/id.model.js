module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      pos_id: Number,
      pre_pos_id: String,
      pos_session: Number,
      pre_pos_session: String,
      transfer_id: Number,
      pre_transfer_id: String,
      pay_id: Number,
      pre_pay_id: String,
      journal_id: Number,
      pre_journal_id: String,
      purchase_id: Number,
      pre_purchase_id: String,
      sale_id: Number,
      pre_sale_id: String,
      bill_id: Number,
      pre_bill_id: String,
      invoice_id: Number,
      pre_invoice_id: String,
      ticket_id: Number,
      pre_ticket_id: String,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Id = mongoose.model("ids", schema);
  return Id;
};