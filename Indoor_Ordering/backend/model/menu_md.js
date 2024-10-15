const mongoose = require('mongoose');
/** 
 * Menu Schema
 * @param {string} Name - Name of the menu item
 * @param {number} Category - 1: Main Course, 2: Side, 3: Drink, 4: Other
 * @param {number} Quantity - Available quantity of the item (drinks may have limited stock)
 * @param {number} Price - Price of the item
 * @param {Buffer} Image - Image of the menu item (Max Size: 16MB)
 * @param {string} Description - Description of the item
 */
const MenuSchema = new mongoose.Schema({
    Name: {
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
        default: 100, // Default stock for drinks
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
        default: "",
    }
});

module.exports = mongoose.model('Menu', MenuSchema, 'Menu');
