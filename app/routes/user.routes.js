module.exports = app => {
    const user = require("../controllers/user.controller.js");
    var router = require("express").Router();

    router.post("/", user.create);

    app.use("/wolkjes/user", router);
}