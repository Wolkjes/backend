# backend

## First start
To get all the node packages first run:
```
npm install express sequelize pg pg-hstore cors jsonwebtoken bcryptjs mqtt --save
```

## Run backend

To run the backend go in the root directory and run:
```
node server.js
```

## Frontend and server files

Clone the frontend from here: [https://github.com/Wolkjes/frontend] and follow the instructions in the README to start the frontend.

Clone the server files from here: [https://github.com/Wolkjes/server] and follow the instructions in the README to run the docker-compose file.

## Add sensor

First update your sensor to the latest version: [https://github.com/Wolkjes/operame]

Then connect your sensor to the network and enter the correct IP-address:
<ol>
    <li>Turn the sensor on</li>
    <li>The sensor makes a wifi connection, connect to this with another device</li>
    <li>Then you will get a message to login on this wifi connection, open this and the configuration page will open in the browser</li>
    <li>Select the correct SSID of the password and enter the password of that SSID</li>
    <li>Enter the correct ip-address in the MQTT ip address box. This is the ip where you run all the server files (docker-compose file)</li>
    <li>Go to the bottom of the page and click on Save</li>
    <li>Then restart your sensor by clicking restart at the top of the page</li>
</ol>
