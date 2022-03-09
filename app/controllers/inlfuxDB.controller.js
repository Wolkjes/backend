const axios = require('axios');
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require("fs");

exports.get = (req, res) => {
    console.log("Het aanmaken van csv file");
    var lokaal_naam = req.params.lokaal_naam;
    var campus_naam = req.params.campus_naam.replace("-", "+");
    console.log(campus_naam, lokaal_naam)
    var url = `http://188.166.43.149:8086/query?q=SELECT+mean("value")as+co2+FROM+"mqtt_consumer"+WHERE+("topic"='${campus_naam}/${lokaal_naam}/co2')+AND+time>=now()-7d+and+time+<=+now()+GROUP+BY+time(2s)+fill(linear);&pretty=true&db=influx`
    axios.get(url).then((result) => {
        var values = result.data.results[0].series[0].values
        const header = result.data.results[0].series[0].columns;
    
        const csv = convertArrayToCSV(values, {
            header,
            seperator: ";"
        });
    
        if (!fs.existsSync("../frontend/src/assets/csv")){
            fs.mkdirSync("../frontend/src/assets/csv");
        }
        if (!fs.existsSync("../frontend/src/assets/csv/"+campus_naam)){
            fs.mkdirSync("../frontend/src/assets/csv/"+campus_naam);
        }
        // C:\Users\Robbe\Documents\school\afstudeerproject\backend\robbe-d\test.csv
        fs.writeFile(("../frontend/src/assets/csv/" + campus_naam + "/" + lokaal_naam + '.csv'), csv, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
            res.send({"value": "ok"})
          });    
      }).catch(error => {
        console.error(error)
      })
}