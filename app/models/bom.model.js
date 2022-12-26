module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      qty: Number,
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      bom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Bom = mongoose.model("boms", schema);
  return Bom;
};