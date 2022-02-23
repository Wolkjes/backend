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

// // Find a single Campus with an id
// exports.findOne = (req, res) => {
//   const campus_id = req.params.id;
//   Campus.findByPk(campus_id)
//     .then(data => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: `Cannot find Campus with id=${campus_id}.`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Campus with id=" + campus_id
//       });
//     });
// };

// // Update a Campus by the id in the request
// exports.update = (req, res) => {
//   const campus_id = req.params.campus_id;
//   Campus.update(req.body, {
//     where: { campus_id: campus_id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Campus was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update Campus with id=${campus_id}. Maybe Campus was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Campus with id=" + campus_id
//       });
//     });
// };

// // Delete a Campus with the specified id in the request
// exports.delete = (req, res) => {
//   const campus_id = req.params.id;
//   Campus.destroy({
//     where: { campus_id: campus_id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Campus was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Campus with id=${campus_id}. Maybe Campus was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Campus with id=" + campus_id
//       });
//     });
// };

// // Delete all Campus from the database.
// exports.deleteAll = (req, res) => {
//   Campus.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Campus were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all Campus."
//       });
//     });
// };