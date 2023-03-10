module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      ticketid: String,
      fullname: String,
      message: String,
      phone: String,
      email: String,
      date_submitted: Date,
      date_expected: Date,
      date_closed: Date,
      stage: Number, //0 Open, 1 Handle, 2 Pending, 3 Done
      asignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Ticket = mongoose.model("tickets", schema);
  return Ticket;
};