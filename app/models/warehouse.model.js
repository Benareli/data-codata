module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      short: String,
      main: Boolean,
      active: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Warehouse = mongoose.model("warehouses", schema);
  return Warehouse;
};