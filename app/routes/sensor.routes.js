module.exports = app => {
    const sensor = require("../controllers/sensor.controller.js");

    var router = require("express").Router();

    router.post("/", sensor.create);

    router.get("/", sensor.findAll);

    router.get("/:sensor_id", sensor.findOne);

    router.get("/getSensorId/:lokaal_id", sensor.findSensorId);

    router.put("/:sensor_id", sensor.change);

    router.delete("/:sensor_id", sensor.delete);
    
    router.get("/get/:sensor_id", sensor.findhim)

    app.use('/wolkjes/sensor', router);
    
}