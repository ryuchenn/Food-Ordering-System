const express = require('express');
const router = express.Router();
const DriverSchema = require('../../model/driver/Driver_md');
const Order = require('../../model/order/Order_md');
const Menu = require('../../model/restaurant/Menu_md');
const Restaurant = require('../../model/restaurant/Restaurant_md');
const Cart = require('../../model/order/Cart_md');
const Account = require('../../model/core/Account_md');
const {VerifyTokenFromCookie, SetUserInformation} = require('../../utils/core/Token')

//////////// API Routes && Input Validation && Error Handling ////////////

router.get('/DriverOrder', VerifyTokenFromCookie, async (req, res) => {
    try {
        res.render('driver/DriverOrder')
    } catch (error) {
        console.error('Error fetching checkout:', error);
    }
});

router.get('/DriverUpdate', VerifyTokenFromCookie, async (req, res) => {
    try {
        res.render('driver/DriverUpdate')
    } catch (error) {
        console.error('Error fetching checkout:', error);
    }
});

module.exports = router;