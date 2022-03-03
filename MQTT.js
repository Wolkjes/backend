const { json } = require('express/lib/response');
const mqtt = require('mqtt')

const host = '188.166.43.149'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`


const lokalen = new Map();
const TimePassed = new Map();

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

});

client.on('message', (topic, message) => {
    const Co2Values = new Map();
    let jsonMessage = JSON.parse(message);
    let campus = topic.split("/")[0]
    let destination = campus + "/" + topic.split("/")[1];
    let teller = 0;
    let vorigeWaarde = 0;
    let returnValue = 0;
    var today = new Date();
    TimePassed.set(destination, today)
    Co2Values.set("campus",campus);
    if (lokalen.has(destination) == false){
        Co2Values.set("waarde",jsonMessage.value);
        Co2Values.set("teller",teller);
        Co2Values.set("output",0);
        lokalen.set(destination, Co2Values);
    }else{
        vorigeWaarde = lokalen.get(destination).get("waarde");
        teller = lokalen.get(destination).get("teller");
        Co2Values.set("waarde",jsonMessage.value);
        Co2Values.set("teller",teller);
        Co2Values.set("output",lokalen.get(destination).get("output"));
        lokalen.set(destination, Co2Values);
    }

    let lokaal = lokalen.get(destination);
    if (jsonMessage.value >=  jsonMessage.critical){
      if(vorigeWaarde+100 < jsonMessage.value){
        if(teller >= 6){
          returnValue = lokaal.get("output");
          returnValue += 10; 
          lokaal.set("output", returnValue);
        }else{
          teller++;
          lokaal.set("output", 50);
          lokaal.set("teller", teller);
        }
      }

        
    }else{
      if(lokaal.get("output") > 20){
        lokaal.set("output",20)
        lokaal.set("teller", 0)
      }else{
        teller = lokaal.get("teller");
        teller ++;
        if (teller >= 6){
          returnValue = lokaal.get("output")
          if(returnValue != 0){
            returnValue -= 10 
            lokaal.set("output", returnValue)
          }else{
            teller = 0;
          }
        }
        lokaal.set("teller", teller)
      }
    }
    
    
    lokalen.set(destination, lokaal);

    
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

