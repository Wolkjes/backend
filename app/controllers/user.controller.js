const dbConfig = require("../config/db.config.js");
const pg = require('pg');

const config = {
  host: dbConfig.HOST,
  user: dbConfig.USER,     
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT
};

const client = new pg.Client(config);

client.connect();

var bcrypt = require("bcryptjs");
const { user } = require("../models/index.js");




exports.create = (req, res) => {
    console.log(`Running query to create user PostgreSQL server: ${config.host}`);
    
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;

    const query = "INSERT INTO persoon(username, email, password, role) VALUES('" + username + "','" + email + "','" + password + "','" + role + "') ON CONFLICT DO NOTHING";
  
  
    client.query(query, (err, data) => {
      if (err) {
          console.error(err);
      } else{
          res.send("ok");
      }
    });
  };