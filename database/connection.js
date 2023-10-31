const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const {MONGO_CONNECTION_URL} = process.env;

module.exports = async function connectToDatabase() {
    await mongoose
    .connect(MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongo Connection Established!");
    })
    .catch((err) => {
      console.log(`Error Occured For MongoDB Connection :\n`);
      console.log(err);
    });
}
