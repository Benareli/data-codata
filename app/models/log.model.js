module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      message: String,
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCat"
      },
      brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand"
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      uom_cat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uomcat"
      },
      uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Uom"
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
      },
      warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse"
      },
      store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
      },
      pos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pos"
      },
      purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase"
      },
      sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale"
      },
      journal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journal"
      },
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    { timestamps: true }
  );
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Log = mongoose.model("logs", schema);
  return Log;
};