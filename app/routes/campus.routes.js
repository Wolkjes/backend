module.exports = app => {
    const campus = require("../controllers/campus.controller.js");

    var router = require("express").Router();

    router.post("/", campus.create);

    router.get("/", campus.findAll);

    router.get("/:campus_id", campus.findOne);

    router.put("/:campus_id", campus.update);

    router.delete("/:campus_id", campus.delete);

    app.use('/wolkjes/campus', router);
}