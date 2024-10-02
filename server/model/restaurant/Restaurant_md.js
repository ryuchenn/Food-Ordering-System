const mongoose = require('mongoose');

/** 
 * Restaurant Schema
 * @param {string} Name - Restaurant Name
 * @param {string} MenuName -
 * @param {int} Quantity - 
 * @param {double} Price - 
 * @param {binData} Image -
 * @param {string} Description - 
 */
const RestaurantSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    MenuName: {
        type: String,
        required: true,
    },
    Quantity: {
        type: Number,
        required: true,
        default: 100, // Default quantity is 100
    },
    Price: {
        type: Number,
        required: true,
        default: 0,
    },
    Image: {
        type: Buffer,
        required: true,
    },
    Description: {
        type: String,
        required: false,
        default: '',
    },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema, 'Restaurant')