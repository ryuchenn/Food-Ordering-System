const mongoose = require('mongoose');
/** 
 * Order Schema
 * @param {string} OID - 
 * @param {string} CustomerName - 
 * @param {string} DeliveryAddress -
 * @param {string} ItemsName - 
 * @param {double} Price - 
 * @param {double} HST - 
 * @param {int} Quantity - 
 * @param {date} OrderDate - 
 * @param {int} Status - 
 * @param {binData} ImageProof - 
 */

const OrderSchema = new mongoose.Schema({
    OID: {
        type: String,
        required: true,
    },
    CustomerName: {
        type: String,
        required: true,
    },
    DeliveryAddress: {
        type: String,
        required: true,
    },
    ItemsName: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        required: true,
        // Can add formula for Price * HST here
    },
    HST: {
        type: Number,
        required: true,
    },
    Quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    OrderDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    Status: {
        type: Number,
        required: true,
        enum: [1, 2, 3], // 1: READY FOR DELIVERY, 2: IN TRANSIT, 3: DELIVERED
        default: 1,
    },
    ImageProof: {
        type: Buffer,
        required: false,
    },
});

module.exports = mongoose.model('Order', OrderSchema, 'Order')