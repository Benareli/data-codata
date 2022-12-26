module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      user_id: String,
      pos_qty: Boolean,
      pos_image: Boolean,
    }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Pref = mongoose.model("prefs", schema);
  return Pref;
};