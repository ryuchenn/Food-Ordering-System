const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerName: { Type: String, required: true },
  deliveryAddress: { Type: String, required: true },
  itemsOrdered: { Type: Array },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "BEING PREPARED" },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
});

module.exports = mongoose.model("Order", OrderSchema, "Order");
