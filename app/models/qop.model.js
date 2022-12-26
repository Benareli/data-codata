module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      qop: Number,
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      cost: Number
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Qop = mongoose.model("qops", schema);
  return Qop;
};