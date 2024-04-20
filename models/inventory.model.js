const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: String,
      required: true,
      unique: false,
    },
    minimumStockLevel: {
      type: Number,
      required: true,
      unique: false,
    },
    status: {
      type: String,
      required: true,
      unique: false,
    },
    oldData : {
      type: Object
    },
    newData : {
      type: Object
    },
    updatedBy : {
      type: String,
      required: true,
      unique: false,
    }
  },
  { timestamps: true }
);

//converting the schema into model to use it for creating documents and then exporting it
module.exports = mongoose.model("Inventory",inventorySchema)



