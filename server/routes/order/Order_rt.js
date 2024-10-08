const express = require("express");
const router = express.Router();
const OrderSchema = require("../../model/order/Order_md");

router.route("/").get(async (req, res) => {
  try {
    const orders = await OrderSchema.find().populate("driver");
    res.render("orders", { orders });
  } catch (err) {
    res.status(500).send("Error fetching orders");
  }
});

module.exports = router;
