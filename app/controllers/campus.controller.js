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

const mqtt = require('mqtt');

const host = '188.166.43.149';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const clientMQTT = mqtt.connect(connectUrl, {
  clientId,
  clean: false,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  keepalive: 20000,
  reconnectPeriod: 1000,
})

// Create and Save a new Campus
exports.create = (req, res) => {
  console.log(`Running query to create campus PostgreSQL server: ${config.host}`);
  console.log(req.body)
  var name = req.body.name;
  var persoon_id = req.body.persoon_id;
  var warning = 700;
  var critical_value = 800;

  const query = "INSERT INTO campus(name, warning_value, critical_value) VALUES('" + name + "', " + warning + ", " + critical_value + ")  ON CONFLICT DO NOTHING";
  const queryGet = "select * from campus order by campus_id desc limit 1";


  client.query(query, (err, data) => {
    if (err) {
        console.error(err);
    }else{
      client.query(queryGet)
      .then(data => {
          const rows = data.rows;

          rows.map(row => {
              console.log(`Read: ${JSON.stringify(row)}`);
          });

          const queryTussenTabel = "INSERT INTO public.campus_persoon(campus_id, persoon_id) vALUES (" + rows[0].campus_id + ", " + persoon_id + ");"

          client.query(queryTussenTabel, (err, data) => {
            if (err) {
              console.error(err);
            }else{
              res.send(rows);
            }
        })
      })
      .catch(err => {
          console.log(err);
      });
    }
  });
};

// Retrieve all Campus from the database.
exports.findAll = (req, res) => {
  console.log(`Running query to find all campuses PostgreSQL server: ${config.host}`);
  const persoon_id = req.params.persoon_id

  const query = "select * from campus_persoon inner join campus using(campus_id) where persoon_id = " + persoon_id;

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

exports.findLatest = (req, res) => {
  console.log(`Running query to find lastest PostgreSQL server: ${config.host}`);

  const query = "select * from campus order by campus_id asc limit 1";

  client.query(query)
      .then(data => {
          const rows = data.rows;
          res.send(rows);

      })
      .catch(err => {
          console.log(err);
      });
};

// Find a single Campus with an id
exports.findOne = (req, res) => {
  console.log(`Running query to find one campuses PostgreSQL server: ${config.host}`);
  const query = "SELECT * FROM campus where campus_id=" + req.params.campus_id;

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
exports.update = (req, res) => {
  console.log(`Running query to update campuses PostgreSQL server: ${config.host}`)
  const campus_id = req.params.campus_id;
  const name = req.body.name;

  const query = "UPDATE campus SET name='" + name + "' WHERE campus_id=" + campus_id;
  const queryGet = "SELECT * FROM campus where campus_id=" + campus_id;

  client.query(query, (err) => {
    if (err) {
        console.error(err);
    }else{
      client.query(queryGet)
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
    }
  });
};

// Delete a Campus with the specified id in the request
exports.delete = (req, res) => {
  console.log(`Running query to delete campuses PostgreSQL server: ${config.host}`)
  const campus_id = req.params.campus_id;
  const query = "DELETE FROM campus WHERE campus_id=" + campus_id;

      client.query(query, (err) => {
        if (err) {
            console.error(err);
        }else{
          clientMQTT.publish(req.body.campus_naam + "/new", JSON.stringify({"key": "delete","value": true}),{retain: true})
          const queryGet = "select * from campus order by campus_id asc limit 1";
    
          client.query(queryGet).then(data => {
              const rows = data.rows;
              res.send(rows);
          })
        }
      });
};