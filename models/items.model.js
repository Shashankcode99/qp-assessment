const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
      unique: false,
    },
    expiryDate: {
      type: String,
      required: false,
      unique: false,
    },
  },
  { timestamps: true }
);

//converting the schema into model to use it for creating documents and then exporting it
module.exports = mongoose.model("Items",itemSchema)



