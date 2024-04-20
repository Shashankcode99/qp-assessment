const dotenv = require("dotenv");
dotenv.config();
const {PORT_NUMBER} = process.env;
const express = require("express");
const app = express();
const morgan = require("morgan");
const connectToDatabase = require("./database/connection");
const userRoute = require("./routes/user.routes.js");
const adminRoute = require("./routes/admin.routes.js");


//Making DB Connection
connectToDatabase();

app.use(express.json());
app.use(morgan());
app.use("/api/auth", userRoute);
app.use("/api/auth", adminRoute);

//Listening the app on PORT 8800
app.listen(PORT_NUMBER, () => {
  console.log(`Backend Server is Running On : ${PORT_NUMBER}`);
});
