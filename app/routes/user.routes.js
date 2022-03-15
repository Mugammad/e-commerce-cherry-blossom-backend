const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const finders = require("../middlewares/finders")
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/users", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);
  app.get("/user", [authJwt.verifyToken, finders.findUser], controller.getUser);
  app.delete("/user", [authJwt.verifyToken, finders.findUser, finders.findCart], controller.removeUser);
  app.patch("/user", [authJwt.verifyToken, finders.findUser], controller.editUser);
};