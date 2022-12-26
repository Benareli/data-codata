module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      tax: Number,
      name: String,
      include: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Tax = mongoose.model("taxs", schema);
  return Tax;
};