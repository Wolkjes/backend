const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/auth/login", controller.login);
};
