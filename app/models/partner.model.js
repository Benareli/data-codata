module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      code: String,
      name: String,
      phone: String,
      isCustomer: Boolean,
      isSupplier: Boolean,
      active: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Partner = mongoose.model("partners", schema);
  return Partner;
};