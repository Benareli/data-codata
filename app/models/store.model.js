module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      store_name: String,
      store_addr: String,
      store_phone: String,
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      active: Boolean
    }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Store = mongoose.model("stores", schema);
  return Store;
};