# backend

To get all the node files first run:
```
npm install express sequelize pg pg-hstore cors jsonwebtoken bcryptjs --save
```

```
curl --location --request POST 'localhost:8080/auth/signin' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=admin@wolkjes.be' \
--data-urlencode 'password=admin'
```

```
node server.js
```

To run the backend go in the root directory and run:
```
node server.js
```