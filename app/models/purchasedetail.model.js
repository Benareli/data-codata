module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      purchase_id: String,
      qty: Number,
      qty_done: Number,
      qty_inv: Number,
      qty_rec: Number,
      price_unit: Number,
      discount: Number,
      tax: Number,
      subtotal: Number,
      date: Date,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      stockmove: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stockmove"
      }]
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Purchasedetail = mongoose.model("purchasedetail", schema);
  return Purchasedetail;
};