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
const { password, rows } = require("pg/lib/defaults");


exports.getAllUsers = (req, res) => {
  console.log(`Running query to get all users PostgreSQL server: ${config.host}`);

  const query = "SELECT persoon_id, username, email, role FROM persoon";

  client.query(query)
    .then(data => {
      const rows = data.rows;
      res.send(rows);
    })
    .catch(err => {
      console.log(err);
    })
}

//Create new user in db
exports.create = (req, res) => {
    console.log(`Running query to create user PostgreSQL server: ${config.host}`);
    
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;

    var campus_id = req.body.campus_id;
    var persoon_id;

    const query = "INSERT INTO persoon(username, email, password, role) VALUES('" + username + "','" + email + "','" + password + "','" + role + "')";
  
  
    client.query(query, (err) => {
      if (err) {
          console.error(err);
          res.send({"value":"Deze user bestaat al"});
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

  exports.tussenTabel = (req, res) => {

    campus_id = req.body.campus_id;
    persoon_id = req.body.persoon_id;

    const querycampus_persoon= "INSERT INTO campus_persoon(campus_id, persoon_id) VALUES(" + campus_id + ", " + persoon_id + ") ON CONFLICT DO NOTHING";
    client.query(querycampus_persoon, (err) => {
      if (err) {
        console.error(err);
      }else {
        res.send({"value": "ok"})
      }
    })
  }

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

exports.addToCampus = (req, res) => {

  console.log("query to insert to tussentabel");

  const campus_id = req.params.campus_id;
  const persoon_id = req.body.persoon_id;

  const query = "SELECT * FROM campus_persoon where campus_id = " + campus_id + " and persoon_id = " + persoon_id + ";";

  client.query(query).then(data => {
    if(data.rows.length === 1){
      res.send({"value":"Al toegevoegd"})
    }else{
      const insertQuery = "INSERT INTO campus_persoon(campus_id, persoon_id) VALUES(" + campus_id + "," + persoon_id + ")";
      client.query(insertQuery, (err) => {
        if(err){
          console.err(err);
        }else{
          res.send({"value": "ok"});
        }
      })
    }
  })
}

// Delete a user by the id in the request
exports.delete = (req, res) => {
  console.log(`Running query to delete a user PostgreSQL server: ${config.host}`);

  const persoon_id = req.body.user_id;
  const campus_id = req.body.campus_id;
  

  //Check if user is in multiple campusses 
  queryCheck = "SELECT * FROM campus_persoon WHERE persoon_id=" + persoon_id
  client.query(queryCheck)
  .then(data => {
    if (data.rows.length <= 1){
      //user is only in one campus..
      //Delete user
      query = "DELETE FROM persoon WHERE persoon_id=" + persoon_id;
        client.query(query, (err) => {
        if (err) {
        console.error(err);
      }else{
          res.send({"value": "ok"})
      }
      });
  
    } else {
      //user is in multiple campusses so only delete the user field in campus_persoon
     //verwijder user van de juiste campus in de tussentabel
      queryTussentabel = "DELETE FROM campus_persoon WHERE persoon_id=" + persoon_id + " AND campus_id=" + campus_id;
      client.query(queryTussentabel, (err) => {
      if (err) {
        console.error(err);
      } else {
        res.send({"value": "ok"})
      }
  }); 
    }
  })
};