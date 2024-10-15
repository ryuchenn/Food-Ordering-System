const mongoose = require('mongoose');
/** 
 * Cart Schema
 * @param {ObjectId} AccountID - References Account._id, null for guest users
 * @param {Array} Items - Array of items added to the cart
 * @param {ObjectId} Items.MenuID - References Menu._id
 * @param {number} Items.Quantity - Quantity of each menu item in the cart
 * @param {date} UpdateAt - Last update time
 */
const CartSchema = new mongoose.Schema({
    AccountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        default: null,
    },
    Items: [{
        MenuID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            required: true,
        },
        Quantity: {
            type: Number,
            required: true,
        }
    }],
    UpdateAt: {
        type: Date,
        required: true,
        default: new Date(),
    }
});

module.exports = mongoose.model('Cart', CartSchema, 'Cart');
