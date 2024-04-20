const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: {
      type: Object,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: String,
      required: true,
      unique: false,
    },
    paymentMode: {
      type: String,
      required: true,
      unique: false,
    },
    orderBy : {
      type: String,
      required: true,
      unique: false,
    }
  },
  { timestamps: true }
);

//converting the schema into model to use it for creating documents and then exporting it
module.exports = mongoose.model("Orders",orderSchema)



