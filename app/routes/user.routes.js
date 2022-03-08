const { authJwt } = require("../middleware");
module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    const user = require("../controllers/user.controller.js");
    var adminRouter = require("express").Router();
    
    adminRouter.post("/", user.create);

    adminRouter.get("/:campus_id/:persoon_id", user.getAll);

    adminRouter.get("/", user.getAllUsers);

    adminRouter.put("/:persoon_id", user.update);

    adminRouter.put("/tussentabel/:campus_id", user.addToCampus);

    adminRouter.delete("/", user.delete);

    app.use("/wolkjes/user", [authJwt.verifyToken, authJwt.isAdmin], adminRouter);
}