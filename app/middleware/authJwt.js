const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.email = decoded.email;
    next();
  });
};

isAdmin = (req, res, next) => {
  try {
    User.findOne({
      where: {
        email: req.email
      }
    }).then(user => {
      if (user.role === "admin") {
        next();
        return;
      }
      res.status(403).send({
        message: "Admin role required"
      });
      return;
    });
  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};
module.exports = authJwt;