module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      qof: Number,
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
      }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Qof = mongoose.model("qofs", schema);
  return Qof;
};