module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      taskname: String,
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      },
      date_start: Date,
      date_end: Date,
      partner: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"}
      ],
      asignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      stage: Number,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Task = mongoose.model("tasks", schema);
  return Task;
};