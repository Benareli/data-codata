module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      date_start: Date,
      date_end: Date,
      partner: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"}
      ],
      stage: [{type: String}],
      journal: [
        {type: mongoose.Schema.Types.ObjectId,
          ref: "Journal"}
      ],
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Project = mongoose.model("projects", schema);
  return Project;
};