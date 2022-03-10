const { authJwt } = require("../middlewares");
const finders = require("../middlewares/finders");
const controller = require("../controllers/product.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/products", controller.getAll);
  app.post("/products", [authJwt.verifyToken, authJwt.isAdmin], controller.addProduct, finders.findUser)
  app.delete("/products/:id", [authJwt.verifyToken, authJwt.isAdmin, finders.findProduct, finders.findUser], controller.removeProduct)
  app.patch("/products/:id", [authJwt.verifyToken, authJwt.isAdmin, finders.findProduct, finders.findUser], controller.updateProduct)
};