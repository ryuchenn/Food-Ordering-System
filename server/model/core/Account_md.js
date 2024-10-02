const mongoose = require('mongoose');

/** 
 * Account Schema
 * @param {string} UserName - 
 * @param {string} Password - 
 * @param {string} FirstName - 
 * @param {string} MiddleName - 
 * @param {string} LastName - 
 * @param {string} Email - 
 * @param {boolean} IsRestaurant - 
 * @param {boolean} IsDriver - 
 * @param {date} CreateAt - 
 * @param {date} UpdateAt - 
 * @param {date} LastLogin - 
 */
const AccountSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    IsRestaurant: {
        type: Boolean,
        required: true,
        default: false
    },
    IsDriver: {
        type: Boolean,
        required: true,
        default: false
    },
    IsCustomer: {
        type: Boolean,
        required: true,
        default: false
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
    },
    LastLogin: {
        type: Date,
        required: true,
        default: new Date(),
    },
});

module.exports = mongoose.model('Account', AccountSchema, 'Account')
