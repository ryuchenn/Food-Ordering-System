const mongoose = require('mongoose');

/** 
 * Restaurant Menu Schema
 * @param {string} Name - Restaurant Name
 * @param {string} MenuName -
 * @param {int} Quantity - 
 * @param {double} Price - 
 * @param {binData} Image -
 * @param {string} Description - 
 */
const MenuSchema = new mongoose.Schema({
    RestaurantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', // Reference to Account collection
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    MenuName: {
        type: String,
        required: true,
    },
    Category: {
        type: Number,
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

module.exports = mongoose.model('Menu', MenuSchema, 'Menu')