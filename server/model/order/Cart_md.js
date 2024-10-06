const mongoose = require('mongoose');

/** 
 * Order - Cart 
 * @param {objectID} AccountID - Account._id
 * @param {objectID} MenuID - Menu._id
 * @param {int} Quantity - 
 * @param {date} CreateAt - 
 */
const CartSchema = new mongoose.Schema({
    AccountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Reference to Account collection
        required: true,
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
            default: 1, 
        }
    }],
    UpdateAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
});

module.exports = mongoose.model('Cart', CartSchema , 'Cart')