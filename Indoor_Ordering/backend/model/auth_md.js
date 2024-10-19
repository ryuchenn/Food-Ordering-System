const mongoose = require('mongoose');
/** 
 * Account Schema
 * @param {string} UserName - Login Username 1.Register User: Username 2. QR Code User: Session.SessionToken
 * @param {string} DisplayName - 1.Register User: Preferred Name 2. QR Code User: TableName
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
    DisplayName: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    SessionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        default: null,
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
