const express = require('express');
const router = express.Router();
const Menu = require('../../model/restaurant/Menu_md');
const Restaurant = require('../../model/restaurant/Restaurant_md');
const Cart = require('../../model/order/Cart_md');
const Account = require('../../model/core/Account_md');
const {VerifyTokenFromCookie, SetUserInformation} = require('../../utils/core/Token')

// Image
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//////////// API Routes && Input Validation && Error Handling ////////////

// Home Page
router.get("/home", SetUserInformation, (req, res) => {
    return res.render("restaurant/RestaurantHome.ejs", {
        GoogleMapAPI: process.env.GOOGLE_MAP_KEY
    })
});

// Menu
router.get("/menu", SetUserInformation, async (req, res, next) => {
    try {
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
        res.render('order/OrderHome',  { MenuItems, CartDataExists, SuccessMessage: undefined, ErrorMessage: undefined});
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send('Error fetching menu');
    }
});

router.get("/restaurant", SetUserInformation, async (req, res, next) => {
    try {
        const RestaurantItems = await Restaurant.find();
        let CartDataExists = false;
        // if (req.cookies.token)
        // {   
        //     AccountData = Account.findById(req.UserID)
        //     const CartData = await Cart.findOne({AccountID: req.UserID});

        //     // If there are more than one item store in Cart. Change the picture.
        //     if (CartData && CartData.Items.length > 0)
        //         CartDataExists = true;
        //     else
        //         CartDataExists = false;
        // }
        res.render('order/OrderHome',  { RestaurantItems, CartDataExists, SuccessMessage: undefined, ErrorMessage: undefined});
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).send('Error fetching menu');
    }
});

// router.post('/cart/add', VerifyTokenFromCookie, async (req, res, next) => {
//     try {
//         if (!req.UserID) {
//             return res.status(404).json({ error: 'User not found.' });
//         }
//         const MenuID = req.body.MenuID;
//         const MenuItem = await Menu.findById(MenuID);
//         const MenuItems = await Menu.find(); // All product

//         if (!MenuItem) {
//             return res.status(404).json({ error: 'Menu item not found.' });
//         }

//         const CartData = await Cart.findOne({
//             AccountID: req.UserID,
//             'Items.MenuID': MenuID
//         });

//         if (!CartData) {
//             const NewCartData = new Cart({
//                 AccountID: req.UserID,
//                 Items: [{ MenuID: MenuID, Quantity: 1 }]
//             });
//             await NewCartData.save();
//         }
//         else {
//             // Check this items exist in the cart
//             const ItemIndex = CartData.Items.findIndex(items => items.MenuID.toString() === MenuID);

//             if (ItemIndex > -1) {
//                 CartData.Items[ItemIndex].Quantity += 1;
//                 await CartData.save();
//             } 
//         }
//         res.status(200).json({ message: 'Item added to cart now!' });
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//         res.status(500).send('Error adding to cart');
//     }
// });

// Book Page
// router.get("/book", SetUserInformation, (req, res) => {
//     return res.render("restaurant/RestaurantBook.ejs")
// });

// About Page
// router.get("/about", SetUserInformation, (req, res) => {
//     return res.render("restaurant/RestaurantAbout.ejs", {
//         GoogleMapAPI: process.env.GOOGLE_MAP_KEY
//     })
// });

// AddMenu Page
router.get("/AddMenu", VerifyTokenFromCookie, (req, res) => {
    return res.render("restaurant/RestaurantAddMenu.ejs")
});

// Add Menu
/**
 * Not Finish Part: 
 * 1. Validiate all of column
 * - Same restaurant but same food name
 * - Quantity = -1 or float
 * - Price less than 0
 * 2. Visitor must can not enter this page even see the [add menu] button
 */
router.post('/AddMenu', VerifyTokenFromCookie, upload.single('Image'), async (req, res, next) => {
    try {
        const UserData = await Account.findById(req.UserID);

        const RestaurantData = await Restaurant.findOne({ AccountID: UserData._id });
        console.log(RestaurantData)

        if (!RestaurantData) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const { MenuName, Category, Quantity, Price, Description } = req.body; // RestaurantName depends on UserID.
        const Image = req.file.buffer; // Get the uploaded image

        const NewMenu = new Menu({
            RestaurantID: req.UserID,
            Name: RestaurantData.Name,
            MenuName: MenuName,
            Category: Category,
            Quantity: Quantity,
            Price: Price,
            Image: Image,
            Description: Description || '', // Optional description
        });

        if (NewMenu) {
            await NewMenu.save();
            return res.render("restaurant/RestaurantAddMenu.ejs", { SuccessMessage: "Insert Success", ErrorMessage: undefined })
        } else {
            return res.render("restaurant/RestaurantAddMenu.ejs", { SuccessMessage: undefined, ErrorMessage: "Insert Error" })
        }
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).send('Error adding menu item');
    }
});

// Test Page
// router.get("/test", (req, res) => {
//     return res.render("restaurant/RestaurantTest.ejs")
// });


module.exports = router;