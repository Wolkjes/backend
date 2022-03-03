module.exports = app => {
    const user = require("../controllers/user.controller.js");
    var router = require("express").Router();

    router.post("/", user.create);

    router.get("/:campus_id", user.getAll);

    router.put("/:persoon_id", user.update)

    router.delete("/", user.delete)

    app.use("/wolkjes/user", router);
}