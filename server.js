const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
//app.use(bodyParser.json());
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencode({extended: true}))
app.use(express.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/campus.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/sensor.routes")(app);
require("./app/routes/lokaal.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});