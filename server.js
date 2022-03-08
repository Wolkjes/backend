const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
var base = process.env['BASE'];

const app = express();

var corsOptions = {
  origin: "http://" + base + ":4200"
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
  res.json({ message: "Welcome." });
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

const { json } = require('express/lib/response');
const mqtt = require('mqtt')

const host = '188.166.43.149'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`


var lokalen = new Map();
var TimePassed = new Map();
var VentilatieWaarde = new Map();

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: false,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  keepalive: 20000,
  reconnectPeriod: 1000,
})
console.log('connecting');
setInterval(checktimePassed, 5000);


client.on('connect', () => {
  console.log('connected');

  client.subscribe('+/+/co2');
  client.subscribe('+/ventilatie/+');
});

client.on('message', (topic, message) => {
  let destination = topic.split("/")[2];
  if(destination == "co2"){
    berekenVentilatie(topic, message);
  }else{
    changeVentilatieWaardes(topic, message);
    
  }

});



client.on('offline', () => {
  console.log('went offline');
});

client.on('error', () => {
  console.log('got error');
});

client.on('close', () => {
  console.log('connection closed');
});

function checktimePassed(){
  var today = new Date()
  for (let [key, value] of TimePassed) {
    previeusDateTime = value
    var sensor = lokalen.get(key).get("sensor")
    var verschil = (today.getTime()- previeusDateTime.getTime()) / 1000;
    if(verschil > 11){
      client.publish(key + "/offline", JSON.stringify({
        "key": "offline"
      }),{ retain: true })
      TimePassed.delete(key)
      lokalen.delete(key)
    }
  }
  client.subscribe('+/ventilatie/+');
  client.subscribe('+/+/co2');
};

function changeVentilatieWaardes(topic, message){
  let campus = topic.split("/")[0];
  let jsonMessage = JSON.parse(message);

  setVentilatiewaardes(campus, jsonMessage.goed, jsonMessage.minder, jsonMessage.slecht);
  
  console.log("waarde word veranderd voor campus: " + campus )
}

function setVentilatiewaardes(campus, goed, minder, slecht){
  var waardes = new Map();
  waardes.set("goed", goed)
  waardes.set("minder", minder);
  waardes.set("slecht", slecht);
  VentilatieWaarde.set(campus, waardes);
};

function berekenVentilatie(topic, message){
  const Co2Values = new Map();
  let jsonMessage = JSON.parse(message);
  let campus = topic.split("/")[0]
  let destination = campus + "/" + topic.split("/")[1];
  let teller = 0;
  let vorigeWaarde = 0;
  let returnValue = 0;
  var today = new Date();
  let lokaal = lokalen.get(destination);
  TimePassed.set(destination, today)

  if(today.getDay() != 0 && today.getDay() != 6){
    
    if (lokalen.has(destination) == false){
        Co2Values.set("waarde",jsonMessage.value);
        Co2Values.set("teller",teller);
        Co2Values.set("output",0);
        if(!VentilatieWaarde.has(campus)){
          setVentilatiewaardes(campus,20,40,80);
        }
        lokalen.set(destination, Co2Values);
    }else{
        vorigeWaarde = lokalen.get(destination).get("waarde");
        teller = lokalen.get(destination).get("teller");
        Co2Values.set("waarde",jsonMessage.value);
        Co2Values.set("teller",teller);
        Co2Values.set("output",lokalen.get(destination).get("output"));
        lokalen.set(destination, Co2Values);
    }

    let critical = VentilatieWaarde.get(campus).get("slecht")
    let warning = VentilatieWaarde.get(campus).get("minder")
    let low = VentilatieWaarde.get(campus).get("goed")

    lokaal = lokalen.get(destination);
    if (jsonMessage.value >=  jsonMessage.critical){
      lokaal.set("output", critical);    
    }else if(jsonMessage.value >=  jsonMessage.warning){
      lokaal.set("output", warning);
    }else{
      lokaal.set("output", low)
    }
  }else{

    
    Co2Values.set("waarde",jsonMessage.value);
    Co2Values.set("teller",0);
    Co2Values.set("output",0);
    if(!VentilatieWaarde.has(campus)){
      setVentilatiewaardes(campus,20,40,80);
    }
    lokalen.set(destination, Co2Values);
    
    lokaal = lokalen.get(destination);

  }
  console.log("Ventilatie staat op " + lokaal.get("output") + "%");

  lokalen.set(destination, lokaal);
}