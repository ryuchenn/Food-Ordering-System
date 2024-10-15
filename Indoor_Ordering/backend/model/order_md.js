const mongoose = require('mongoose');

/** 
 * Order Schema
 * @param {number} Type - 1: Dine-in, 2: Take-out, 3: Delivery
 * @param {ObjectId} AccountID - References Account._id; null if it's a visitor
 * @param {Array} Items - Array of ordered menu items
 * @param {ObjectId} Items.MenuID - References Menu._id
 * @param {number} Items.Quantity - Quantity of the ordered menu item
 * @param {number} Items.Price - Price of the menu item
 * @param {object} Driver - Information about the delivery (for delivery orders only)
 * @param {number} Driver.Platform - 1: UberEats, 2: ...
 * @param {string} Driver.DriverName - Name of the delivery driver
 * @param {string} Driver.CustomerName - Name of the person receiving the order
 * @param {string} Driver.Address - Delivery address
 * @param {number} Driver.PickupStatus - 1: READY FOR DELIVERY, 2: BE PICKED UP
 * @param {date} Driver.PickupDate - Date when the order was picked up
 * @param {number} Status - 1: Unpaid, 2: Paid
 * @param {date} OrderDate - Date the order was placed
 * @param {date} UpdateAt - Last update time
 */
const OrderSchema = new mongoose.Schema({
    Type: {
        type: Number,
        required: true,
    },
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
        },
        Price: {
            type: Number,
            required: true,
        }
    }],
    Driver: {
        Platform: {
            type: Number,
            default: null,
        },
        DriverName: {
            type: String,
            default: null,
        },
        CustomerName: {
            type: String,
            default: null,
        },
        Address: {
            type: String,
            default: null,
        },
        PickupStatus: {
            type: Number,
            default: null,
        },
        PickupDate: {
            type: Date,
            default: null,
        }
    },
    Status: {
        type: Number,
        required: true,
        default: 1, // Unpaid by default
    },
    OrderDate: {
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

module.exports = mongoose.model('Order', OrderSchema, 'Order');
