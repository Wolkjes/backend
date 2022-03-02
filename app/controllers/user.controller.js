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
const res = require("express/lib/response");



//Create new user in db
exports.create = (req, res) => {
    console.log(`Running query to create user PostgreSQL server: ${config.host}`);
    
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;

    var campus_id = req.body.campus_id;
    var persoon_id;

    const query = "INSERT INTO persoon(username, email, password, role) VALUES('" + username + "','" + email + "','" + password + "','" + role + "') ON CONFLICT DO NOTHING";
  
  
    client.query(query, (err) => {
      if (err) {
          console.error(err);
      } 
      else{
          res.send("Added user succesfully!");

          const queryGetIdFromEmail = "SELECT persoon_id FROM persoon WHERE email='" + email + "'";
          client.query(queryGetIdFromEmail).then(persoon => {
              persoon_id = persoon.rows[0].persoon_id

              const querycampus_persoon= "INSERT INTO campus_persoon(campus_id, persoon_id) VALUES(" + campus_id + ", " + persoon_id + ") ON CONFLICT DO NOTHING";
              client.query(querycampus_persoon, (err) => {
                  if (err) {
                    console.error(err);
                  }
                  else {
                    // res.send({"value": "ok"})
                  }
              })
          })
      }

    });
  };
