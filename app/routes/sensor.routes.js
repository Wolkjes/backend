module.exports = app => {
    const sensor = require("../controllers/sensor.controller.js");

    var router = require("express").Router();

    router.post("/", sensor.create);

    router.get("/", sensor.findAll);

    router.get("/:sensor_id", sensor.findOne);

    router.put("/:sensor_id", sensor.change);

    router.delete("/:sensor_id", sensor.delete);

    app.use('/wolkjes/sensor', router);
}