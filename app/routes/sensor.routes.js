const { authJwt } = require("../middleware");
module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    const sensor = require("../controllers/sensor.controller.js");

    var userRouter = require("express").Router();
    var adminRouter = require("express").Router();

    // enkel voor admin
    adminRouter.post("/", sensor.create);
    adminRouter.put("/:sensor_id", sensor.change);
    adminRouter.delete("/:sensor_id", sensor.delete);

    // ook voor user
    userRouter.get("/:sensor_id", sensor.findOne);
    userRouter.get("/", sensor.findAll);
    userRouter.get("/:sensor_id", sensor.findOne);

    router.get("/:sensor_id", sensor.findOne);

    router.get("/getSensorId/:lokaal_id", sensor.findSensorId);

    router.put("/:sensor_id", sensor.change);

    router.delete("/:sensor_id", sensor.delete);
    
    router.get("/get/:sensor_id", sensor.findhim)

    app.use("/wolkjes/sensor", [authJwt.verifyToken, authJwt.isAdmin], userRouter);
    app.use("/wolkjes/sensor", [authJwt.verifyToken, authJwt.isAdmin], adminRouter);
}