module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      uom_cat: String,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Uomcat = mongoose.model("uomcats", schema);
  return Uomcat;
};