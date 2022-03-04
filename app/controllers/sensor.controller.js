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

exports.findSensorId = (req, res) => {
  console.log(`Running query get sensor by lokaalid to PostgreSQL server: ${config.host}`);
  
  var lokaal_id = req.params.lokaal_id;

  const query = "SELECT * FROM sensor where lokaal_id=" + lokaal_id;


  client.query(query, (err, data) => {
    if (err) {
        console.error(err);
    }else{
        res.send(data.rows);
    }
  });
}

// Create and Save a new sensor
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
        res.send({"value": "Added sensor"});
    }
  });
};

// Retrieve all sensors from the database.
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

// Find a single sensor with an id
exports.findOne = (req, res) => {
  const query = "SELECT * FROM sensor INNER JOIN lokaal using(lokaal_id)  where sensor_id='" + req.params.sensor_id + "'";
  
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

//??
exports.findhim = (req, res) => {
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


// Update a sensor by the id in the request
exports.change = (req, res) => {
  console.log("query to update a sensor");
  const sensor_id = req.params.sensor_id;
  const newS = req.body.new;
  const campus_id = req.body.campus_id;
  const lokaal = req.body.lokaal;
  let lokaal_id = 0;
  let test = 0;
  let aantal = 0;

  const querySearch = "select lokaal_id from lokaal as l  inner join campus as c using(campus_id) where campus_id = " + campus_id + " and lokaal_naam = '" + lokaal + "'";

    client.query(querySearch).then(dataSearch => {
      if (lokaal_id === 0){
        if (dataSearch.rows.length === 0){
        
          const addLokaalQuery = "INSERT INTO lokaal(campus_id, lokaal_naam) VALUES (" + campus_id + ",'" +  lokaal + "');";
      
          client.query(addLokaalQuery, (err) => {
            if (err) {
                console.error(err);
            }
            const queryLokaal_id = "select * from lokaal order by lokaal_id desc limit 1";
    
            client.query(queryLokaal_id).then(dataLokaal => {
              lokaal_id = dataLokaal.rows[0].lokaal_id;  
              const queryHoogste = "select max(id) from lokaal as l inner join campus as c using(campus_id) inner join sensor as s using(lokaal_id) where campus_id =" + campus_id;
              client.query(queryHoogste).then(data => {   
              aantal = data.rows[0].max+1;
            
                    const queryUpdate = "UPDATE sensor SET lokaal_id='" + lokaal_id + "', new=" + newS + ", id=" + aantal + " WHERE sensor_id='" + sensor_id + "'";
            
                    client.query(queryUpdate, (err) => {
                      if (err) {
                          console.error(err);
                      }else{

                          res.send({"value":"ok"});
                      }
                    });
            
                  }).catch(err => {
                    console.log(err);
                  });
            })  
          })

        }else{
          lokaal_id = dataSearch.rows[0].lokaal_id;
          const queryHoogste = "select max(id) from lokaal as l inner join campus as c using(campus_id) inner join sensor as s using(lokaal_id) where campus_id =" + campus_id;
          client.query(queryHoogste).then(data => {   
          aantal = data.rows[0].max+1;
        
                const queryUpdate = "UPDATE sensor SET lokaal_id='" + lokaal_id + "', new=" + newS + ", id=" + aantal + " WHERE sensor_id='" + sensor_id + "'";
        
                client.query(queryUpdate, (err) => {
                  if (err) {
                      console.error(err);
                  }else{
                      res.send({"value":"ok"});
                  }
                });
        
              }).catch(err => {
                console.log(err);
              });
        }
      }
    })
};


// Delete a sensor with the specified id in the request
exports.delete = (req, res) => {
  const campus_id = req.params.campus_id;

  const query = "DELETE FROM campus WHERE campus_id=" + campus_id;

  client.query(query, (err) => {
    if (err) {
        console.error(err);
    }else{
      res.send({"value":"Delete succesvol"});
    }
  });
};