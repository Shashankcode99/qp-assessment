const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
      unique: false,
    },
    summary: {
      type: String,
      required: true,
      unique: false,
    },
    publishedYear: {
      type: String,
      required: true,
      unique: false,
    },
    price: {
      type: String,
      required: true,
      unique: false,
    },
    createdBy : {
      type: String,
      required: true,
      unique: false,
    }
  },
  { timestamps: true }
);

//converting the schema into model to use it for creating documents and then exporting it
module.exports = mongoose.model("Books",booksSchema)



