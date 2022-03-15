const jwt = require('jsonwebtoken')

exports.getCart = async (req, res) => {
    let cart = res.cart
    try {
        res.status(200).json({cart})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

exports.add = async (req, res) => {
    let cart = res.cart;
    if(req.userInfo.cart){
        cart.products = req.userInfo.cart.products
    }
    let product = res.product
    let inCart = false
    let cartFull = false // cart has a max capacity
    try {
        if(cart.quantity == cart.total){
            cartFull = true
        }
        if(cartFull){
            return res.status(405).send({ message: "Cart is full" });
        }
        if(product){
            if(product.qty < req.body.qty){
                return res.status(405).send({ message: "Not enough items in stock" });
            }
            if((cart.total - cart.quantity) < req.body.qty){
                return res.status(405).send({ message: "Not enough space in cart" });
            }
            cart.quantity += req.body.qty
            product.qty -= req.body.qty

            let addedProduct = {
                id: product._id,
                title: product.title,
                img: product.img,
                description: product.description,
                size: product.size,
                category: product.category,
                price: product.price,
            }
            console.log(cart.products);
            cart.products.forEach(item => {
                if(item.id == addedProduct.id.valueOf()){
                    inCart = true
                    item.qty += req.body.qty
                    console.log(res.cart);
                    res.cart.products = cart.products
                }
            });
            if(!inCart){
                cart.products.push({...addedProduct, qty: req.body.qty})
                res.cart.products = cart.products
            }
        }
        const updatedCart = cart
        // console.log(cart)
        let token = jwt.sign({ id: res.user._id, cart}, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
        });
        res.cart = cart
        await product.save()
        await res.cart.save()
        res.status(201).json({message: "added to cart",updatedCart, accessToken: token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.emptyCart = async (req, res) => {
    try {
        res.cart.products = []
        res.cart.quantity = 0
        await res.cart.save()
        let token = jwt.sign({ id: res.user._id }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
          });
        res.status(201).json({message: "Cart Emptied!", accessToken: token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.removeCartItem = async (req, res) => {
    let cart = res.cart;
    if(req.userInfo.cart){
        cart.products = req.userInfo.cart.products
    }
    let product = res.product
    try {
        cart.products.forEach((item, i) => {
            if(item.id == product._id.valueOf()){
                //remove the item from products array
                cart.products.splice(i, 1)
                res.cart.products = cart.products
                //edit cart quantity value
                cart.quantity -= item.qty
                product.qty += item.qty
            }
        })
        res.cart = cart
        await product.save()
        const updatedCart = await res.cart.save()
        let token = jwt.sign({ id: res.user._id, cart }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
          });
        res.status(202).json({message: "Cart Item removed", accessToken: token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}

exports.changeQty = async (req, res) => {
    
}