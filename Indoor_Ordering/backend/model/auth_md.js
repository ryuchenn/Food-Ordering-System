const mongoose = require('mongoose');
/** 
 * Account Schema
 * @param {string} UserName - Username for the account
 * @param {string} Password - Password for the account
 * @param {boolean} IsCustomer - Whether the user is a customer
 * @param {date} CreateAt - Account creation date
 * @param {date} UpdateAt - Last update time
 * @param {date} LastLogin - Last login time
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
    IsCustomer: {
        type: Boolean,
        required: true,
        default: true,
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
    }
});

module.exports = mongoose.model('Account', AccountSchema, 'Account');
