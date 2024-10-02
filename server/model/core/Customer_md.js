const mongoose = require('mongoose');

/** 
 * Person Schema
 * @param {string} FirstName - 
 * @param {string} MiddleName -
 * @param {string} LastName -
 * @param {string} Address - 
 * @param {string} Phone - 
 * @param {string} Email - 
 * @param {date} CreateAt - 
 * @param {date} UpdateAt -
 */
const CustomerSchema = new mongoose.Schema({
    AccountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Reference to Account collection
        required: true,
    },
    FirstName: {
        type: String,
        required: true, 
    },
    MiddleName: {
        type: String,
        required: false,
    },
    LastName: {
        type: String,
        required: true, 
    },
    Address: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
        required: true, 
    },
    Email: {
        type: String,
        required: true, 
    },
    CreateAt: {
        type: Date,
        required: true,
        default: new Date(), 
    },
    UpdateAt: {
        type: Date,
        required: true, 
        default: new Date(), 
    }
});

module.exports = mongoose.model('Customer', CustomerSchema, 'Customer');
