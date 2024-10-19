const express = require("express");
const router = express.Router();
const Account = require("../model/auth_md");
const Cart = require("../model/cart_md");
const Menu = require("../model/menu_md");
const Order = require("../model/order_md");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Session = require("../model/session_md");
// const { VerifyTokenFromCookie, SetUserInformation,} = require("../utils/Token");

/////////////////// Setting API (Register, Login, Logout .....)  Router Start ///////////////////

// Register (Account)
router.post('/register', async (req, res) => {
    const { username, DisplayName, password} = req.body;

    try {
        let username2 = username.toLowerCase().trim();

        const existingUser = await Account.findOne({ username2 });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Account({ UserName: username2, Password: hashedPassword, DisplayName: DisplayName.trim(), SessionID: null});
  
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login (Account)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {

        const user = await Account.findOne({ UserName: username.toLowerCase().trim() });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials1' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials2' });
        }
        
        // Generate JWT
        const token = jwt.sign({ _id: user._id, id: user._id, ID: user._id }, process.env.LOGGING_JWT_SECRET, { expiresIn: '3h' });

        // Send token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 9000000, // 2 hour and 30 mins
            sameSite: 'Lax',
        });

        res.status(200).json({ user: { _id: user._id, id: user._id, ID: user._id, SessionID: user.SessionID, Username: user.UserName, DisplayName: user.DisplayName,} });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Login (QR Code)
router.post('/login/QRCode/:TableName', async (req, res) => {
    const { TableName } = req.params;

    try {
        // Generate the 15 digits random string for SessionToken
        let SessionToken = "";

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            SessionToken += characters[randomIndex];
        }

        let session;
        if (!session) {
            session = new Session({ SessionToken: SessionToken, TableName: TableName});
            await session.save();
        }

        const QRCodeUser = new Account({ UserName: SessionToken, Password: SessionToken, DisplayName: TableName, SessionID: session._id});
        await QRCodeUser.save();

        const updatedSession = await Session.findOneAndUpdate(
            { SessionToken: SessionToken, TableName: TableName },
            { $set: { AccountID: QRCodeUser._id } },
            { new: true }  
        );

        // Generate JWT
        const token = jwt.sign({ id: QRCodeUser._id, _id: QRCodeUser._id, ID: QRCodeUser._id }, process.env.LOGGING_JWT_SECRET, { expiresIn: '3h' });

        // Send token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 9000000, // 2 hour and 30 mins
            sameSite: 'Strict',
        });

        res.status(200).json({ user: { _id: QRCodeUser._id, id: QRCodeUser._id, ID: QRCodeUser._id, SessionID: QRCodeUser.SessionID, Username: QRCodeUser.UserName, DisplayName: QRCodeUser.DisplayName,} });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in with QR code', error });
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