require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.DB_DEFAULT_PORT;
const app = express();

mongoose.connect("mongodb://" + process.env.DB_ConnectionString +"/" + process.env.DB_USE)
        .then(() => console.log("Connect MongoDB Success!"))
        .catch((err) => console.error("Connect MongoDB Error: " + err));
app.use(cors({ origin: process.env.Frontend_Setting, credentials: true }));
// app.use(cors());

app.use(bodyParser.json());
app.use(express.json({ limit: "15mb", type: 'application/json; charset=UTF-8'  }));
app.use(express.urlencoded({ limit: "15mb", extended: true })); // allowed 50MB for url data
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.IsLoggedIn = !!req.cookies.token;
    next();
});

/// TEST
app.use((req, res, next) => {
  console.log('TESTING Cookies: ', req.cookies.token); 
  next();
});

//////////// MongoDB and Mongoose ////////////
// const { RestaurantSchema } = require("./model/restaurant/Restaurant_md");
const { AccountSchema } = require("./model/auth_md");
const { CartSchema } = require("./model/cart_md");
const { MenuSchema } = require("./model/menu_md");
const { OrderSchema } = require("./model/order_md");

//////////// RESTfulAPI Routes && Input Validation && Error Handling ////////////
app.use("/api/auth", require("./routes/auth_rt"));
app.use("/api/cart", require("./routes/cart_rt"));
app.use("/api/menu", require("./routes/menu_rt"));
app.use("/api/order", require("./routes/order_rt"));

//////////// Services ////////////
// const {cleanUpExpiredSessions1, cleanUpExpiredSessions2} = require('./service/cleanupSession'); 
// cleanUpExpiredSessions1(); // per day clear the QR Code login account
// setInterval(cleanUpExpiredSessions2, 60 * 1000); // per three hours clear the session

//////////// Testing(Unit Test) ////////////

// Unit test don't run this
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


app.listen(port, '0.0.0.0',() => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });

// Unit test need to export this.
// Expected an Express application object rather than an object that started the server.
module.exports = app;