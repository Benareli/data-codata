module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      order_id: String,
      date: Date,
      disc_type: String,
      discount: Number,
      amount_subtotal: Number,
      amount_untaxed: Number,
      amount_tax: Number,
      amount_total: Number,
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      pos_detail:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Posdetail"}
      ],
      payment:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"}
      ],
      open: Boolean,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Pos = mongoose.model("pos", schema);
  return Pos;
};