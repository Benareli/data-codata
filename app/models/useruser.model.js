module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      username: String,
      password: String,
      roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }],
      pos_open: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const User = mongoose.model("users", schema);
  return User;
};