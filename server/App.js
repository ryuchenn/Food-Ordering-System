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
const app = express()
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_NAME + ".5nu9r.mongodb.net/" + process.env.DB_USE)
        .then(()=> console.log("Connect MongoDB Success!"))
        .catch(err => console.err("Connect MongoDB Error: "+ err))
app.use(express.json());


//////////// MongoDB and Mongoose ////////////
// Loading & Initialize Model
const { TaskSchema } = require('./model/Sample_md');
// const { XXXchema } = require('./model/restaurant/XXX_md');
// const { YYYSchema } = require('./model/order/YYY_md');
// const { ZZZSchema } = require('./model/driver/ZZZ_md');


//////////// RESTfulAPI Routes && Input Validation && Error Handling ////////////
// Import the route. 
app.use('/sample', require('./routes/Sample_rt'))   // (GET,POST,....) EX: /sample/task
// app.use('/restaurant', require('./routes/restaurant/'))
// app.use('/order', require('./routes/order/'))
// app.use('/driver', require('./routes/driver/'))


//////////// 6. Testing ////////////
// Code at server/tests/assigment1.test.js


// Unit test don't run this
app.listen(process.env.DB_DEFAULT_PORT, () => {
    console.log("Server is running")
})

// Unit test need to export this. 
// Expected an Express application object rather than an object that started the server.
module.exports = app;