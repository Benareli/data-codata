module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      sale_id: String,
      date: Date,
      expected: Date,
      disc_type: String,
      discount: Number,
      amount_untaxed: Number,
      amount_tax: Number,
      amount_total: Number,
      delivery_state: Number, //0 No, 1 Partial, 2 Complete
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      sale_detail:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Saledetail"}
      ],
      payment:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"}
      ],
      paid: Number, //0 No, 1 Partial, 2 Complete
      open: Boolean,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Sale = mongoose.model("sales", schema);
  return Sale;
};