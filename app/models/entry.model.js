module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      journal_id: String,
      debit_acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coa"
      },
      credit_acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coa"
      },
      debit: Number,
      credit: Number,
      label: String,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      qty: Number,
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      price_unit: Number,
      tax: Number,
      discount: Number,
      subtotal: Number,
      date: Date
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Entry = mongoose.model("entrys", schema);
  return Entry;
};