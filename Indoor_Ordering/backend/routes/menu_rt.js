const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Account = require("../model/auth_md");
const Cart = require("../model/cart_md");
const Menu = require("../model/menu_md");
const Order = require("../model/order_md");
const { VerifyTokenFromCookie, SetUserInformation,} = require("../utils/Token");

// Get all menu from Menu collection
router.get('/', async (req, res) => {
    try {
        const menuItems = await Menu.find({Category: { $gte: 1, $lte: 4 }});
        const formattedItems = menuItems.map(item => ({
            ...item.toObject(),
            Image: `data:image/png;base64,${item.Image.toString('base64')}`
        }));

        res.status(200).send(formattedItems);
    } catch (err) {
        res.status(400).send(err);
    }
});

// AddMenu Form:  Add new menu item
router.post('/add', upload.single('Image'), async (req, res) => {
    const { Name, Category, Quantity, Price, Description, Options } = req.body;
    const Image = req.file ? req.file.buffer : null;

    if (!Image) {
        return res.status(400).send('Image is required');
    }

    const parsedOptions = JSON.parse(Options);

    const newMenuItem = new Menu({
        Name,
        Category: Number(Category),
        Quantity: Number(Quantity),
        Price: Number(Price),
        Description,
        Image,
        Options: parsedOptions,
    });

    try {
        const savedMenuItem = await newMenuItem.save();

        res.status(200).send(savedMenuItem);
    } catch (error) {
        res.status(400).send('Failed to add menu item');
    }
});

// MenuDetail: Get add-ons (Category = 5)
router.get('/category5', async (req, res) => {
    try {
        const addons = await Menu.find({ Category: 5 });
        res.status(200).json(addons.map(addon => ({
            ...addon.toObject(),
            Image: addon.Image.toString('base64'),
        })));
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve add-ons', error });
    }
});

// MenuDetail: Get a single menu item by ID
router.get('/:id', async (req, res) => {
    const menuItemId = req.params.id;

    try {
        const menuItem = await Menu.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Return the menu item with Image converted to base64
        res.status(200).json({
            ...menuItem.toObject(),
            Image: menuItem.Image.toString('base64'),
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve menu item', error });
    }
});

module.exports = router;