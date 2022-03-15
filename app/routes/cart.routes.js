const { authJwt } = require("../middlewares");
const finders = require("../middlewares/finders");
const controller = require("../controllers/cart.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/cart", [authJwt.verifyToken, finders.findCart], controller.getCart);
  app.post("/cart/:id", [authJwt.verifyToken, finders.findCart, finders.findProduct, finders.findUser], controller.add)
  app.delete("/cart", [authJwt.verifyToken, finders.findCart, finders.findUser], controller.emptyCart)
  app.patch("/cart/:id", [authJwt.verifyToken, finders.findCart, finders.findProduct, finders.findUser], controller.removeCartItem)
  app.put("/cart/:id", [authJwt.verifyToken, finders.findCart, finders.findProduct, finders.findUser], controller.changeQty)
};