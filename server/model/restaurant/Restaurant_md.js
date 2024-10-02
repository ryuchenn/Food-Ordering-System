const mongoose = require('mongoose');

/** 
 * Restaurant Schema
 * @param {string} Name - 
 * @param {string} Address - 
 * @param {string} Phone - 
 * @param {string} OpenHours 
 * @param {string} Cuisine - The type of cuisine the restaurant serves (e.g., Chinese, French, Fast food, Japanese). This field is required.
 * @param {number} LocationLongitude - The longitude of the restaurant's location. This field is optional.
 * @param {number} LocationLatitude - The latitude of the restaurant's location. This field is optional.
 * @param {date} CreateAt - The date the restaurant record was created. Default is the current date.
 */
const RestaurantSchema = new mongoose.Schema({
    AccountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Reference to Account collection
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true, 
    },
    Phone: {
        type: String,
        required: true, 
    },
    OpenHours: {
        type: String,
        required: true,
    },
    Cuisine: {
        type: String,
        required: true, 
    },
    LocationLongitude: {
        type: Number,
        required: false, // optional
    },
    LocationLatitude: {
        type: Number,
        required: false, //  optional
    },
    CreateAt: {
        type: Date,
        required: true,
        default: new Date(),
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema, 'Restaurant')