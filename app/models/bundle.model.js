module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      bundle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      qty: Number,
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      product: {
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
  const Bundle = mongoose.model("bundles", schema);
  return Bundle;
};