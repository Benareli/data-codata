module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      pay_id: String,
      order_id: String,
      amount_total: Number,
      payment1: Number,
      pay1method: String,
      pay1note: String,
      payment2: Number,
      pay2method: String,
      pay2note: String,
      change: Number,
      changeMethod: String,
      date: Date,
      type: String, //0 - in, 1 - out
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Payment = mongoose.model("payments", schema);
  return Payment;
};