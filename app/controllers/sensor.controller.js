const dbConfig = require("../config/db.config.js");
const pg = require('pg');
const res = require("express/lib/response");

const config = {
  host: dbConfig.HOST,
  user: dbConfig.USER,     
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT
};

const client = new pg.Client(config);

client.connect();

// Create and Save a new Campus
exports.create = (req, res) => {
  console.log(`Running query create sensor to PostgreSQL server: ${config.host}`);
  
  var sensor_id = req.body.sensor_id;
  var lokaal_id = req.body.lokaal_id;
  var newS = req.body.new;
  var id = req.body.id;

  const query = "INSERT INTO sensor(sensor_id, lokaal_id, new, id) VALUES('" + sensor_id + "', " + lokaal_id + ", " + newS + ", " + id + ") ON CONFLICT DO NOTHING";


  client.query(query, (err, data) => {
    if (err) {
        console.error(err);
    }else{
        res.send("Added sensor");
    }
  });
};

// Retrieve all Campus from the database.
exports.findAll = (req, res) => {
  console.log(`Running query get all sensors to PostgreSQL server: ${config.host}`);

  const query = "SELECT * FROM sensor where new = true";

  client.query(query)
      .then(data => {
          const rows = data.rows;

          rows.map(row => {
              console.log(`Read: ${JSON.stringify(row)}`);
          });

          res.send(rows);

      })
      .catch(err => {
          console.log(err);
      });
};

// Find a single Campus with an id
exports.findOne = (req, res) => {
  const query = "SELECT * FROM sensor where sensor_id='" + req.params.sensor_id + "'";

  client.query(query)
      .then(data => {
          const rows = data.rows;

          console.log(`Read: ${JSON.stringify(rows)}`);

          res.send(rows);

      })
      .catch(err => {
          console.log(err);
      });
};

// Update a Campus by the id in the request
exports.change = (req, res) => {
  console.log("query to update a sensor");
  const sensor_id = req.params.sensor_id;
  console.log(req.params.sensor_id)
  const newS = req.body.new;
  const campus_id = req.body.campus_id;
  const lokaal = req.body.lokaal;
  var lokaal_id = null;
  var aantal = 0;

  const query = "select lokaal_id from lokaal as l  inner join campus as c using(campus_id) where campus_id = " + campus_id + " and lokaal_naam = '" + lokaal + "'";

  client.query(query).then(data => {
    lokaal_id = data.rows[0].lokaal_id;

      const queryHoogste = "select max(id) from lokaal as l inner join campus as c using(campus_id) inner join sensor as s using(lokaal_id) where campus_id =" + campus_id;
      client.query(queryHoogste).then(data => {   
        aantal = data.rows[0].max+1;

        const queryUpdate = "UPDATE sensor SET lokaal_id='" + lokaal_id + "', new=" + newS + ", id=" + aantal + " WHERE sensor_id='" + sensor_id + "'";

        client.query(queryUpdate, (err) => {
          if (err) {
              console.error(err);
          }else{
              console.log("ok");
              res.send("ok");
          }
        });

      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
};


// Delete a Campus with the specified id in the request
exports.delete = (req, res) => {
  const campus_id = req.params.campus_id;

  const query = "DELETE FROM campus WHERE campus_id=" + campus_id;

  client.query(query, (err) => {
    if (err) {
        console.error(err);
    }else{
      res.send("Delete succesvol");
    }
  });
};