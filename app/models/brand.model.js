module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
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
  const Brand = mongoose.model("brands", schema);
  return Brand;
};