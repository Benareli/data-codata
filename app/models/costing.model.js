module.exports = mongoose => {
  var schema = mongoose.Schema(
    {      
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      overhead: Number,
      ovType: String,
      ovTime: Number,
      labor: Number,
      laType: String,
      laTime: Number
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Bom = mongoose.model("costings", schema);
  return Bom;
};