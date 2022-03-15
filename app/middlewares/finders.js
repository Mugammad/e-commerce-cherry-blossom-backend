const db = require('../models')
const Product = db.product
const User = db.user
const Cart = db.cart

exports.findProduct = async (req, res, next) => {
    Product.findOne({
        _id: req.params.id
      }).exec((err, product) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if(product){
            res.product = product
            next()
        }
      })
}

exports.findUser = async (req, res, next) => {
    User.findOne({
        _id: req.userId
      }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if(user){
            res.user = user
            next()
        }
      })
}

exports.findCart = async (req, res, next) => {
  Cart.findOne({
      userId: req.userId.valueOf()
    }).exec((err, cart) => {
      if (err) {
          res.status(500).send({ message: err });
          return;
      }
      if(cart){
          res.cart = cart
          next()
      }
    })
}