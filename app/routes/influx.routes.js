module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    const influx = require("../controllers/inlfuxDB.controller.js");

    var router = require("express").Router();

    router.get("/:campus_naam/:lokaal_naam", influx.get);

    app.use("/wolkjes/inlfux", router);
}