const mongoose = require("mongoose");
/**
 * Order Schema
 * @param {string} AccountID -
 * @param {} Items - from Cart
 * @param {string} CustomerName -
 * @param {string} Address -
 * @param {date} OrderDate -
 * @param {Number} Status - 1: READY FOR DELIVERY, 2: IN TRANSIT, 3: DELIVERED
 * @param {Number} PayStatus -  1: Unpaid, 2: Paid
 * @param {Number} ShippingCost -
 * @param {Number} HST -
 * @param {Number} TotalPrice - (Items.Price+Shipping Cost)*HST
 * @param {binData} ImageProof -
 */

const OrderSchema = new mongoose.Schema({
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
        },
        Price: {
            type: Number,
            required: true,
        },
    }],
    DriverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: false, // It will be updated after the driver get this order
    },
    CustomerName: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
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
    PayStatus: {
        type: Number,
        required: true,
        enum: [1, 2], // 1: Unpaid, 2: Paid
        default: 1,
    },
    ShippingCost: {
        type: Number,
        required: true,
    },
    HST: {
        type: Number,
        required: true,
    },
    TotalPrice: {
        type: Number,
        required: true,
    },
    ImageProof: {
        type: Buffer,
        required: false,
    },
});

module.exports = mongoose.model("Order", OrderSchema, "Order");
