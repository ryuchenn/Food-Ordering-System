const express = require('express');
const router = express.Router();
const Order = require('../../model/order/Order_md');
const Menu = require('../../model/restaurant/Menu_md');
const Restaurant = require('../../model/restaurant/Restaurant_md');
const Cart = require('../../model/order/Cart_md');
const Account = require('../../model/core/Account_md');
const {VerifyTokenFromCookie, SetUserInformation} = require('../../utils/core/Token')
//////////// API Routes && Input Validation && Error Handling ////////////

// Order Home Page
router.get("/OrderHome", SetUserInformation, async (req, res, next) => {
    try {

        res.render('order/OrderHome');
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send('Error fetching menu');
    }
});

// Simulating the order interface
router.get("/OrderTest", SetUserInformation, async (req, res, next) => {
    try {
        if (req.cookies.token === undefined)
        {
            return res.render('core/Login.ejs');
        }
        // else
        //     res.render('order/OrderHome');

        const MenuItems = await Menu.find();
        let CartDataExists = false;
        if (req.cookies.token)
        {   
            AccountData = Account.findById(req.UserID)
            const CartData = await Cart.findOne({AccountID: req.UserID});

            // If there are more than one item store in Cart. Change the picture.
            if (CartData && CartData.Items.length > 0)
                CartDataExists = true;
            else
                CartDataExists = false;
        }
        res.render('order/OrderTest',  { MenuItems, CartDataExists, SuccessMessage: undefined, ErrorMessage: undefined});
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send('Error fetching menu');
    }
});

// Simulating the items add in the Cart
router.post('/cart/add', VerifyTokenFromCookie, async (req, res, next) => {
    try {
        if (!req.UserID) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const MenuID = req.body.MenuID;
        const MenuItem = await Menu.findById(MenuID);
        const MenuItems = await Menu.find(); // All product

        if (!MenuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        const CartData = await Cart.findOne({
            AccountID: req.UserID,
            // 'Items.MenuID': MenuID
        });

        if (!CartData) { // No any data in Cart collection
            const NewCartData = new Cart({
                AccountID: req.UserID,
                Items: [{ MenuID: MenuID, Quantity: 1 }]
            });
            await NewCartData.save();
        }
        else {
            // Check this items exist in the cart
            const ItemIndex = CartData.Items.findIndex(items => items.MenuID.toString() === MenuID);
            if (ItemIndex > -1) {
                CartData.Items[ItemIndex].Quantity += 1;
            } else {
                // If the item doesn't exist, add a new entry to the Items array
                CartData.Items.push({ MenuID: MenuID, Quantity: 1 });
            }
            CartData.UpdateAt = new Date(); // Update to the lastest datetime
            await CartData.save();

        }
        res.status(200).json({ message: 'Item added to cart now!' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Error adding to cart');
    }
});

// Cart Page
router.get("/OrderCart", SetUserInformation, async (req, res) => {
    try {
        if (req.cookies.token === undefined)
            {
                return res.render('core/Login.ejs');
            }
            // else
            //     res.render('order/OrderHome');

        const CartData = await Cart.find({ AccountID: req.UserID })
        .populate({
            path: 'Items.MenuID', 
            // populate: {
            //     path: 'RestaurantID',
            //     model: 'Restaurant'  
            // }
        });
        let CartItems = [];
        CartData.forEach(cart => {
            CartItems = CartItems.concat(cart.Items);
        });

        res.render('order/OrderCart', { CartItems: CartItems });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Error fetching cart');
    }
});

// delete all item
// router.post('/cart/remove_item', VerifyTokenFromCookie, async (req, res) => {
//     const { ItemID } = req.body;
//     try {
//         const CartData = await Cart.findOne({ AccountID: req.UserID, 'Items._id': ItemID });
//         if (!CartData) {
//             return res.status(404).json({ success: false, message: 'Cart not found' });
//         }

//         await Cart.deleteOne({ _id: CartData._id });
//         res.json({ success: true });
//     } catch (error) {
//         console.error('Error removing item:', error);
//         res.status(500).send('Error removing item');
//     }
// });

// Remove Cart Item: 
router.post('/cart/remove_item', VerifyTokenFromCookie, async (req, res) => {
    const { ItemID } = req.body;

    try {
        // Find the cart that belongs to the user
        const CartData = await Cart.findOne({ AccountID: req.UserID });

        if (!CartData) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the specific item in the cart's items array
        const ItemIndex = CartData.Items.findIndex(item => item._id.toString() === ItemID);

        if (ItemIndex > -1) {
            // Check if the item quantity is more than 1
            if (CartData.Items[ItemIndex].Quantity > 1) {
                // Decrease the quantity by 1
                CartData.Items[ItemIndex].Quantity -= 1;
            } else {
                // If quantity is 1, remove the item completely
                CartData.Items.splice(ItemIndex, 1);
            }

            // Update the last modified date
            CartData.UpdateAt = new Date();

            // Save the updated cart
            await CartData.save();

            return res.json({ success: true, message: 'Item updated in cart' });
        } else {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item:', error);
        return res.status(500).send('Error removing item');
    }
});


router.post('/cart/update_quantity', VerifyTokenFromCookie, async (req, res) => {
    const { ItemID, Quantity } = req.body;
    try {
        const CartData = await Cart.findOne({ AccountID: req.UserID });
        const itemIndex = CartData.Items.findIndex(item => item._id == ItemID);

        if (itemIndex !== -1) {
            CartData.Items[itemIndex].Quantity = Quantity;
            await CartData.save();
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).send('Error updating quantity');
    }
});

router.get('/checkout', VerifyTokenFromCookie, async (req, res) => {
    try {
        // Parse the selected items (which include the MenuID and Quantity)
        const selectedItems = JSON.parse(decodeURIComponent(req.query.items));

        const CartData = await Cart.findOne({ AccountID: req.UserID }).populate('Items.MenuID');

        if (!CartData || CartData.Items.length === 0) {
            return res.status(400).send('Cart is empty');
        }

        // Filter the cart to only include the selected items
        const FilteredItems = CartData.Items.filter(item =>
            selectedItems.some(selected => selected.MenuID === item._id.toString())
        );

        // Update the quantities of the selected items based on user input
        FilteredItems.forEach(item => {
            const selectedItem = selectedItems.find(selected => selected.MenuID === item.MenuID._id.toString());
            if (selectedItem) {
                item.Quantity = parseInt(selectedItem.Quantity, 10);
            }
        });

        // Calculate the subtotal, shipping cost, HST, and total based on the filtered items
        const Subtotal = FilteredItems.reduce((sum, item) => sum + (item.Quantity * item.MenuID.Price), 0);
        const ShippingCost = 5.00; // Static shipping cost for this example
        const HST = Subtotal * 0.13;
        const Total = Subtotal + ShippingCost + HST;

        // Render the checkout page with the calculated values
        res.render('order/OrderCheckout', { 
            Subtotal: Subtotal.toFixed(2),
            ShippingCost: ShippingCost.toFixed(2),
            HST: HST.toFixed(2),
            TotalPrice: Total.toFixed(2),
            FilteredItems
        });
    } catch (error) {
        console.error('Error fetching checkout:', error);
        res.status(500).send('Error fetching checkout');
    }
});

router.post('/checkout/confirm', VerifyTokenFromCookie, async (req, res) => {
    try {
        const { CustomerName, Address, Delivery, FilteredItems } = req.body;
        const ParsedFilteredItems = JSON.parse(FilteredItems);
        
        // ParsedFilteredItems.forEach(item => {
        //     console.log("Product Name: ", item.MenuID.MenuName);
        //     console.log("Quantity: ", item.Quantity);
        //     console.log("Price: ", item.MenuID.Price);
        // });

        const NewOrder = new Order({
            AccountID: req.UserID,
            Items: ParsedFilteredItems.map(item => ({
                MenuID: item.MenuID._id,
                Quantity: item.Quantity,
                Price: item.MenuID.Price
            })),
            //DriverID: undefined, // It will be updated after the driver get this order
            CustomerName: CustomerName,
            Address: Address,
            OrderDate: new Date(),
            Status: 1,
            PayStatus: 1,
            ShippingCost: Delivery === '1' ? 5.00 : 0,
            HST: ParsedFilteredItems.reduce((sum, item) => sum + (item.Quantity * item.MenuID.Price * 0.13), 0),
            TotalPrice: ParsedFilteredItems.reduce((sum, item) => sum + (item.Quantity * item.MenuID.Price), 0) // Quantity*Price
        });

        await NewOrder.save();

        const CartData = await Cart.findOne({ AccountID: req.UserID });
        if (!CartData) {
            return res.status(404).send('Cart not found');
        }

        // Remove the items from Cart
        const RemainingItems = CartData.Items.filter(item => {
            return !ParsedFilteredItems.some(filteredItem => filteredItem.MenuID._id === item.MenuID.toString());
        });

        CartData.Items = RemainingItems;
        await CartData.save();

        // Pass order data to the receipt page
        res.render('order/OrderReceipt', {
            OrderID: NewOrder._id,
            CustomerName: NewOrder.CustomerName,
            Address: NewOrder.Address,
            OrderDate: NewOrder.OrderDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
            Items: ParsedFilteredItems, // Pass selected items for receipt
            Subtotal: NewOrder.TotalPrice.toFixed(2),
            HST: NewOrder.HST.toFixed(2),
            ShippingCost: NewOrder.ShippingCost.toFixed(2),
            TotalPrice: (NewOrder.TotalPrice + NewOrder.HST + NewOrder.ShippingCost).toFixed(2)
        });
        // res.status(200).send('Order placed successfully');
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).send('Error confirming order');
    }
});

router.get('/Receipt', VerifyTokenFromCookie, async (req, res) => {
    try {
        res.render('order/OrderReceipt')
    } catch (error) {
        console.error('Error fetching receipt:', error);
    }
});


router.get('/OrderStatusRestaurant', VerifyTokenFromCookie, async (req, res) => {
    try {
        res.render('order/OrderStatusRestaurant')
    } catch (error) {
        console.error('Error fetching checkout:', error);
    }
});

router.get('/OrderStatusCustomer', VerifyTokenFromCookie, async (req, res) => {
    try {
        res.render('order/OrderStatusCustomer')
    } catch (error) {
        console.error('Error fetching checkout:', error);
    }
});

module.exports = router;