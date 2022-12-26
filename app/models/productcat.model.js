module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      catid: String,
      description: String,
      active: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const ProductCat = mongoose.model("productcats", schema);
  return ProductCat;
};