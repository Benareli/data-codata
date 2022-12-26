module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      journal_id: String,
      entries:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Entry"}
      ],
      amount: Number,
      payments: Number,
      date: Date,
      duedate: Date,
      state: Number, //0 - Unpaid, 1 - Partial, 2 - Full Paid
      lock: Boolean,
      type: String, //journal, invoice, bill, payment, transfer, pos
      origin: String,
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      payment:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"}
      ],
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Journal = mongoose.model("journals", schema);
  return Journal;
};