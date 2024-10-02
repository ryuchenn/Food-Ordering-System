const mongoose = require('mongoose');

/** 
 * Driver Schema
 * @param {ObjectId} AccountID - The unique reference to the Account schema.
 * @param {string} Password - 
 * @param {string} FirstName -
 * @param {string} MiddleName - 
 * @param {string} LastName - 
 * @param {string} VehicleBrand - 
 * @param {string} VehicleModel - 
 * @param {string} VehicleColor - 
 * @param {string} VehicleLicense - 
 */
const DriverSchema = new mongoose.Schema({
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
    VehicleBrand: {
        type: String,
        required: true,
    },
    VehicleModel: {
        type: String,
        required: true,
    },
    VehicleColor: {
        type: String,
        required: true,
    },
    VehicleLicense: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Driver', DriverSchema, 'Driver')