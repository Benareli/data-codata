module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      session_id: String,
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
      },
      time_open: Date,
      time_close: Date,
      shift: Number,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      pos:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Pos"}
      ],
      payment:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"}
      ],
      start_balance: Number,
      end_balance: Number,
      money_in: Number,
      money_out: Number,
      total_discount: Number,
      total_amount_untaxed: Number,
      total_amount_tax: Number,
      total_amount_total: Number,
      open: Boolean
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Possession = mongoose.model("possessions", schema);
  return Possession;
};