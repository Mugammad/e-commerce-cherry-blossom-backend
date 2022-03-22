const mongoose = require("mongoose");
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: false,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
  },
  {timestamps: true})
);
module.exports = Product;