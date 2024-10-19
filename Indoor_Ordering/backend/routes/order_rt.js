const express = require("express");
const router = express.Router();
const Account = require("../model/auth_md");
const Cart = require("../model/cart_md");
const Menu = require("../model/menu_md");
const Order = require("../model/order_md");
const Session = require("../model/session_md");
const { VerifyTokenFromCookie, SetUserInformation,} = require("../utils/Token");

// Place an order
router.post('/submit', async (req, res) => {
    const { Type, AccountID, SessionID, Items, Drivers, TotalPrice } = req.body;
    try {
        // QRcode
        const user = await Account.findById(AccountID);
        const table = await Session.findById(SessionID);

        if (!user && !table) {
            return res.status(404).json({ message: 'Account or Session not found' });
        }

        // Create the Order
        const order = new Order({
            Type: 1,    // 1.Dine-in 2.Take-out 3.Delivery
            AccountID: AccountID,
            AccountDisplayName: user.DisplayName,
            Items: Items, // Food Items (MenuID, OptionName, Optionvalue, Quantity, Price)
            Driver: null,
            TotalPrice: TotalPrice,
            Status: 1, // 1: Unpaid 2. Paid
            OrderDate: new Date(),
            UpdateAt: new Date(),
        });
        await order.save();

        // Clear Cart Collections by Account
        await Cart.findOneAndUpdate(
            { AccountID: AccountID },
            { $set: { Items: [], UpdateAt: new Date() } }
        );

        res.status(200).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error });
    }
});

// UnPaidOrder: Mark the unpaid order to paid status
router.post('/:id/markAsPaid', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, { Status: 2 }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark order as paid', error });
    }
});

 // Mark as Done when the food has already given to the customer
router.post('/item/:itemId/UpdateDone', async (req, res) => {
    const { itemId } = req.params;
    const { Done } = req.body;

    try {
        const orderItem = await Order.updateOne(
            { 'Items._id': itemId, Status: 1 },
            { $set: { 'Items.$.Done': Done } }
        );

        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
});

// Get the unpaid orders for the kitchen
router.get('/unpaid', async (req, res) => {
    try {
         //  status=1=Unpaid, 2=Paid
        const orders = await Order.find({ Status: 1 })
                                  .populate('AccountID', 'UserName')
                                  .populate( {path: 'Items.MenuID'});
        console.log(orders)
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
});

router.get('/ordercheck', async (req, res) => {
    const { status } = req.query; 
    try {
        const query = status ? { Status: parseInt(status) } : {};
        const orders = await Order.find(query).populate('AccountID').populate('Items.MenuID');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
});

module.exports = router;