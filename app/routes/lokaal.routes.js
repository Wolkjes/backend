module.exports = app => {
    const lokaal = require("../controllers/lokaal.controller.js");

    var router = require("express").Router();

    // router.post("/", lokaal.create);

    router.get("/:campus_id", lokaal.findAll);

    // router.get("/:lokaal_id", lokaal.findOne);

    router.put("/:lokaal_id", lokaal.update);

    router.delete("/:lokaal_id", lokaal.delete);

    app.use('/wolkjes/lokaal', router);
}