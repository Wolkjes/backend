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

// Create and Save a new Campus
exports.create = (req, res) => {
  console.log(`Running query to PostgreSQL server: ${config.host}`);
  
  var name = req.body.name;
  var good = req.body.good_value;
  var max = req.body.max_value;
  var critical_value = req.body.critical_value;

  const query = "INSERT INTO campus(name, good_value, max_value, critical_value) VALUES('" + name + "', " + good + ", " + max + ", " + critical_value + ")";
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

          res.send(rows);

      })
      .catch(err => {
          console.log(err);
      });
    }
  });
};

// Retrieve all Campus from the database.
exports.findAll = (req, res) => {
  console.log(`Running query to PostgreSQL server: ${config.host}`);

  const query = "SELECT * FROM campus";

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