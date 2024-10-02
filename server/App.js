/** 
 * Project Overview Setup
 * @constructs {} Model -  # The collections of MongoDB. File at ./model
 * @view {} UI - User Interface.  File at ./view
 * @contoller {} Controller - Responsible for handling user input and application logic. File at ./controller
 * @routes {} routes - RESTful API. File at ./routes
 */

//////////// Set up &&  Environment Variables ////////////
require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const path = require("path");
const app = express()
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_NAME + ".5nu9r.mongodb.net/" + process.env.DB_USE)
        .then(()=> console.log("Connect MongoDB Success!"))
        .catch(err => console.err("Connect MongoDB Error: "+ err))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//////////// MongoDB and Mongoose ////////////
// Loading & Initialize Model
// const { TaskSchema } = require('./model/Sample_md');
const { RestaurantSchema } = require('./model/restaurant/Restaurant_md');
const { MenuSchema } = require('./model/restaurant/Menu_md');
const { OrderSchema } = require('./model/order/Order_md');
const { DriverSchema } = require('./model/driver/Driver_md');
const { AccountSchema } = require('./model/core/Account_md');
const { CustomerSchema } = require('./model/core/Customer_md');

app.set("view engine", "ejs") // above the endpoints. below the "const" statments
app.set("views", path.join(__dirname, "views")) 

//////////// RESTfulAPI Routes && Input Validation && Error Handling ////////////
// app.use('/sample', require('./routes/Sample_rt'))   //// Example: GET localhost:3005/sample/task
app.use('/restaurant', require('./routes/restaurant/Restaurant_rt'))
app.use('/order', require('./routes/order/Order_rt'))
app.use('/driver', require('./routes/driver/Driver_rt'))
app.use('/account', require('./routes/core/Account_rt'))

//////////// 6. Testing ////////////
// Code at server/tests/XXXXX.test.js

// Unit test don't run this
app.listen(process.env.DB_DEFAULT_PORT, () => {
    console.log("Server is running")
})

// Unit test need to export this. 
// Expected an Express application object rather than an object that started the server.
module.exports = app;