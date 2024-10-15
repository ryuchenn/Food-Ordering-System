const express = require("express");
const router = express.Router();
const Account = require("../model/auth_md");
const Cart = require("../model/cart_md");
const Menu = require("../model/menu_md");
const Order = require("../model/order_md");
const { VerifyTokenFromCookie, SetUserInformation,} = require("../utils/Token");

/////////////////// Setting API (Register, Login, Logout .....)  Router Start ///////////////////

// Register
router.post('/register', registerUser);

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(500).json({
                message: 'Failed to login',
                user: user,
            });
        }
        const token = jwt.sign({ id: user.uid, username: user.username }, process.env.Session_SecretKey, {
            expiresIn: '1h',
        });

        return res.json({ status: 200, token: token });
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).json({ message: 'Error log out' });
        req.session.destroy((err) => {
            if (err)
                return res.status(500).json({ message: 'Error destroying session' });
            res.clearCookie('connect.sid');
            res.clearCookie('token');
            res.status(200).json({status: 200, message: 'Logout successful' });
        });
    });
});

module.exports = router;