const { authJwt } = require("../middleware");
module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    const lokaal = require("../controllers/lokaal.controller.js");

    var userRouter = require("express").Router();
    var adminRouter = require("express").Router();

    // enkel voor admin
    // adminRouter.post("/", lokaal.create);
    // adminRouter.put("/:lokaal_id", lokaal.update);
    // adminRouter.delete("/:lokaal_id", lokaal.delete);

    // ook voor user
    userRouter.get("/:campus_id", lokaal.findAll);
    // userRouter.get("/:lokaal_id", lokaal.findOne);

    app.use("/wolkjes/lokaal", [authJwt.verifyToken, authJwt.isAdmin], userRouter);
    app.use("/wolkjes/lokaal", [authJwt.verifyToken, authJwt.isAdmin], adminRouter);
}