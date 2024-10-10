const express = require("express");
const router = express.Router();
const DriverSchema = require("../../model/driver/Driver_md");
const Order = require("../../model/order/Order_md");
const Menu = require("../../model/restaurant/Menu_md");
const Restaurant = require("../../model/restaurant/Restaurant_md");
const Cart = require("../../model/order/Cart_md");
const Account = require("../../model/core/Account_md");
const {
  VerifyTokenFromCookie,
  SetUserInformation,
} = require("../../utils/core/Token");

//////////// API Routes && Input Validation && Error Handling ////////////

//API to get the number or orders (with status Ready to deliver) for a driver
router.get("/DriverOrder", VerifyTokenFromCookie, async (req, res) => {
  try {
    const orders = await Order.find({ Status: 1 });
    res.render("driver/DriverOrder", { orders });
  } catch (err) {
    res.status(500).send("Error fetching orders.");
  }
});

//API to change the order status to In Transit
router.post("/:id/updateToTransit", VerifyTokenFromCookie, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { Status: 2 });
    res.redirect("/driver/DriverOrder");
  } catch (err) {
    res.status(500).send("Error Updating order status");
  }
});

//API to get the list of orders (with status in transit) for specific driver
router.get("/DriverUpdate", VerifyTokenFromCookie, async (req, res) => {
  try {
    //Get the loggedIn userId using cookie middleware function
    const loggedInUser = req.UserId;

    //Fetch orders with intransit status for the loggedIn-User
    // const orders = await Order.find({
    //   Status: 2,
    //   // driver: loggedInUser,
    // });

    const orders = await Order.find({ Status: 2 });

    //Render all the orders in the ejs template
    res.render("driver/DriverUpdate", { orders });
  } catch (err) {
    res.status(500).send("Error fetching in-transit orders");
  }
});

router.post("/:id/DriverUpdate", VerifyTokenFromCookie, async (req, res) => {
  try {
    const orderId = req.params.id;

    //Update the status of the order to delievered
    await Order.findByIdAndUpdate(orderId, { Status: 3 });

    res.redirect("/driver/DriverUpdate");
  } catch (err) {
    res.status(500).send("Error Updating order Status");
  }
});

module.exports = router;
