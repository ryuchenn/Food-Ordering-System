const express = require("express");
const router = express.Router();
const Account = require("../model/auth_md");
const Cart = require("../model/cart_md");
const Menu = require("../model/menu_md");
const Order = require("../model/order_md");
const { VerifyTokenFromCookie, SetUserInformation,} = require("../utils/Token");

// Get cart items
router.get('/:accountId', async (req, res) => {
    const { accountId } = req.params;
    
    try {
        const cart = await Cart.findOne({ AccountID: accountId }).populate('Items.MenuID');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const items = cart.Items.map(item => ({
            MenuID: item.MenuID._id,
            Name: item.MenuID.Name,
            Price: item.MenuID.Price,
            Quantity: item.Quantity,
            ItemOptions: item.ItemOptions,
        }));

        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve cart', error });
    }
});

// Add  data from MenuDetail page to Cart Collections
router.post('/add', async (req, res) => {
    const { AccountID, Items } = req.body;

    try {
        // Create a new cart document or update existing one for the user
        const cart = await Cart.findOneAndUpdate(
            { AccountID },
            { $set: { Items, UpdateAt: new Date() } },
            { new: true, upsert: true } // Create if doesn't exist
        );
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add items to cart', error });
    }
});

// Update Cart Quantity by AccountID
router.post('/update', async (req, res) => {
    const { AccountID, MenuID, Quantity } = req.body;
    try {
        const cart = await Cart.findOne({ AccountID: AccountID });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.Items.find(item => item.MenuID.toString() === MenuID);
        
        if (item) {
            item.Quantity = Quantity;
            await cart.save();
            res.status(200).json({ message: 'Quantity updated', cart });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update quantity', error });
    }
});

// Delete Cart Items by AccountID
router.delete('/delete', async (req, res) => {
    const { AccountID, MenuID } = req.body;
    try {
        const cart = await Cart.findOne({ AccountID: AccountID });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.Items = cart.Items.filter(item => item.MenuID.toString() !== MenuID);
        await cart.save();
        res.status(200).json({ message: 'Item removed', cart });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete item', error });
    }
});

module.exports = router;