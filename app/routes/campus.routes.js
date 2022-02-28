const { authJwt } = require("../middleware");
module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
      
    const campus = require("../controllers/campus.controller.js");

    var userRouter = require("express").Router();
    var adminRouter = require("express").Router();

    // enkel voor admin
    adminRouter.post("/", campus.create);
    adminRouter.put("/:campus_id", campus.update);
    adminRouter.delete("/:campus_id", campus.delete);

    // ook voor user
    userRouter.get("/", campus.findAll);
    userRouter.get("/latest", campus.findLatest);
    userRouter.get("/:campus_id", campus.findOne);
    
    app.use("/wolkjes/campus", [authJwt.verifyToken, authJwt.isAdmin], userRouter);
    app.use("/wolkjes/campus", [authJwt.verifyToken, authJwt.isAdmin], adminRouter);
}