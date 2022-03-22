const db = require("../models");
const Product = db.product
const jwt = require('jsonwebtoken')
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find()
        res.json({products})
    } catch (err){
        res.status(500).json({message: err.message})
    }
}

exports.addProduct = async (req, res) => {
    let { title, category, description, img, price, qty, size} = req.body
    const product = new Product({
        title,
        category,
        description,
        img,
        price,
        qty,
        size
    })

    try {
        const newProduct = await product.save()
        let token = jwt.sign({ id: res.user._id }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
          });
        res.status(201).json({newProduct, accessToken: token})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

exports.removeProduct = async (req, res) => {
    try {
        await res.product.remove()
        let token = jwt.sign({ id: res.user._id }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
          });
        res.status(201).json({message: "Product removed!", accessToken: token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.updateProduct = async (req, res) => {
    let { title, category, description, img, price, qty, size, salePrice} = req.body
    try {
        if(title) {
            res.product.title = title
        }
        if(category) {
            res.product.category = category
        }
        if(description) {
            res.product.description = description
        }
        if(img) {
            res.product.img = img
        }
        if(price) {
            res.product.price = price
        }
        if(qty) {
            res.product.qty = qty
        }
        if(size) {
            res.product.size = size
        }
        if(salePrice) {
            res.product.salePrice = salePrice
        }
        
        let token = jwt.sign({ id: res.user._id }, process.env.SECRET, {
          expiresIn: 86400 // 24 hours
        });

        const updatedProduct = await res.product.save()
        res.status(201).json({updatedProduct, accessToken: token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}