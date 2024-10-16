const express = require("express");
const router = express.Router();
const Account = require("../model/auth_md");
const Cart = require("../model/cart_md");
const Menu = require("../model/menu_md");
const Order = require("../model/order_md");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { VerifyTokenFromCookie, SetUserInformation,} = require("../utils/Token");

/////////////////// Setting API (Register, Login, Logout .....)  Router Start ///////////////////

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await Account.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Account({ UserName: username, Password: hashedPassword, IsCustomer:1 });
  
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Account.findOne({ UserName: username });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials1' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials2' });
        }
        
        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.LOGGING_JWT_SECRET, { expiresIn: '3h' });

        // Send token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7200000, // 2 hour
            sameSite: 'Strict',
        });

        res.status(200).json({ user: { id: user._id, username: user.UserName, IsCustomer:1 } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Logout user (client-side token handling)
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

// Check the account is in login status
router.get('/check', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.LOGGING_JWT_SECRET);
        
        const user = await Account.findById(decoded.id).select('-Password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;