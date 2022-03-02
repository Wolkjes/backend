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
const { password } = require("pg/lib/defaults");



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
          const queryGetIdFromEmail = "SELECT persoon_id FROM persoon WHERE email='" + email + "'";
          client.query(queryGetIdFromEmail).then(persoon => {
              persoon_id = persoon.rows[0].persoon_id

              const querycampus_persoon= "INSERT INTO campus_persoon(campus_id, persoon_id) VALUES(" + campus_id + ", " + persoon_id + ") ON CONFLICT DO NOTHING";
              client.query(querycampus_persoon, (err) => {
                  if (err) {
                    console.error(err);
                  }
                  else {
                    res.send({"value": "ok"})
                  }
              })
          })
      }

    });
  };

  //get all Users from the active campus
exports.getAll = (req, res) => {
  console.log(`Running query to get all user PostgreSQL server: ${config.host}`);

  var campus_id = req.params.campus_id;

  const query = "SELECT persoon_id, username, email, role FROM persoon INNER JOIN campus_persoon using(persoon_id) WHERE campus_id = " + campus_id + ""

  client.query(query)
    .then(data => {
      const rows = data.rows;

      rows.map(row => {

      })

      res.send(rows);
    })
    .catch(err => {
      console.log(err);
    })
}

// Update a user by the id in the request
exports.update = (req, res) => {
  console.log(`Running query to update a user PostgreSQL server: ${config.host}`);

  const persoon_id = req.params.persoon_id;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  var query;

  if  (password === ""){
    query = "UPDATE persoon SET username='" + username + "', email='" + email + "', role='" + role + "'WHERE persoon_id=" + persoon_id;
  }else{
    query = "UPDATE persoon SET username='" + username + "', email='" + email + "', password='" + password + "', role='" + role + "'WHERE persoon_id=" + persoon_id;
  }


  client.query(query, (err) => {
    if (err) {
        console.error(err);
    }else{
        res.send({"value": "ok"})
    }
  });
};

// Delete a user by the id in the request
exports.delete = (req, res) => {
  console.log(`Running query to delete a user PostgreSQL server: ${config.host}`);

  const persoon_id = req.params.persoon_id;

    query = "DELETE FROM persoon WHERE persoon_id=" + persoon_id;


  client.query(query, (err) => {
    if (err) {
        console.error(err);
    }else{
        res.send({"value": "ok"})
    }
  });
};