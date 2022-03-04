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


// Retrieve all lokalen from the database.
exports.findAll = (req, res) => {
  console.log(`Running query to PostgreSQL server: ${config.host}`);

  const query = "select * from lokaal as l inner join campus as c using(campus_id) full outer join sensor using(lokaal_id) where campus_id = " + req.params.campus_id + " order by lokaal_naam";

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

// // Create and Save a new Campus
// exports.create = (req, res) => {
//   console.log(`Running query to PostgreSQL server: ${config.host}`);
  
//   var name = req.body.name;
//   var good = req.body.good_value;
//   var max = req.body.max_value;
//   var critical_value = req.body.critical_value;

//   const query = "INSERT INTO campus(name, good_value, max_value, critical_value) VALUES('" + name + "', " + good + ", " + max + ", " + critical_value + ")";
//   const queryGet = "select * from campus order by campus_id desc limit 1";


//   client.query(query, (err, data) => {
//     if (err) {
//         console.error(err);
//     }else{
//       client.query(queryGet)
//       .then(data => {
//           const rows = data.rows;

//           rows.map(row => {
//               console.log(`Read: ${JSON.stringify(row)}`);
//           });

//           res.send(rows);

//       })
//       .catch(err => {
//           console.log(err);
//       });
//     }
//   });
// };

// // Retrieve all Campus from the database.
// exports.findAll = (req, res) => {
//   console.log(`Running query to PostgreSQL server: ${config.host}`);

//   const query = "SELECT * FROM campus";

//   client.query(query)
//       .then(data => {
//           const rows = data.rows;

//           rows.map(row => {
//               console.log(`Read: ${JSON.stringify(row)}`);
//           });

//           res.send(rows);

//       })
//       .catch(err => {
//           console.log(err);
//       });
// };

// // Find a single Campus with an id
// exports.findOne = (req, res) => {
//   const query = "SELECT * FROM campus where campus_id=" + req.params.campus_id;

//   client.query(query)
//       .then(data => {
//           const rows = data.rows;

//           console.log(`Read: ${JSON.stringify(rows)}`);

//           res.send(rows);

//       })
//       .catch(err => {
//           console.log(err);
//       });
// };

// Update a Lokaal by the id in the request
exports.update = (req, res) => {
  console.log(`Running query to update lokaal from PostgreSQL server: ${config.host}`);

  const lokaal_id = req.params.lokaal_id;
  const lokaal_naam = req.body.lokaal_naam;
  const sensor_id = req.body.sensor_id;
  const campus_naam = req.body.campus_naam;
  const oud_lokaal = req.body.oud_lokaal;

  const query = "UPDATE lokaal SET lokaal_naam='" + lokaal_naam + "' WHERE lokaal_id=" + lokaal_id;

  client.query(query, (err) => {
    if (err) {
        console.error(err);
    }else{
        clientMQTT.publish(campus_naam + "/"+oud_lokaal + "/new", JSON.stringify({"key": "new","value": false, "lokaal": lokaal_naam}),{retain: true})
        clientMQTT.publish(sensor_id + "/new", JSON.stringify({"key": "new","value": false, "lokaal": lokaal_naam}),{retain: true})
        clientMQTT.publish(campus_naam + "/"+lokaal_naam + "/new", JSON.stringify({"key": "new","value": false}),{retain: true})
        res.send({"value": "ok"})
    }
  });
};

// Delete a lokaal with the specified id in the request
exports.delete = (req, res) => {
    console.log(`Running query to delete a sensor and lokaal from PostgreSQL server: ${config.host}`);
    const lokaal_id = req.params.lokaal_id;

  const querySensor = "DELETE FROM sensor WHERE lokaal_id=" + lokaal_id;

  client.query(querySensor, (err) => {
    if (err) {
        console.error(err);
    }else{
        const query = "DELETE FROM lokaal WHERE lokaal_id=" + lokaal_id;

        client.query(query, (err) => {
            if (err) {
                console.error(err);
            }else{
                clientMQTT.publish(req.body.campus_naam + "/" + req.body.lokaal_naam + "/new", JSON.stringify({"key": "new","value": true, "lokaal": ""}),{retain: true})
                res.send({"value": "Delete succesvol"});
            }
        });
    }
  });
};