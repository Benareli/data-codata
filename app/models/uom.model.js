module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      uom_name: String,
      uom_cat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uomcat"
      },
      ratio: Number,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Uom = mongoose.model("uoms", schema);
  return Uom;
};