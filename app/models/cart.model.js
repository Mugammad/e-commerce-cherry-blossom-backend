const mongoose = require("mongoose");
const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    products: {
        type: Array,
        required: false,
        default: []
    }
  })
);
module.exports = Cart;