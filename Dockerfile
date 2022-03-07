FROM node:latest

RUN mkdir -p /var/www/html/backend
WORKDIR /var/www/html/backend
COPY server.js /var/www/html/backend
COPY . /var/www/html/backend

RUN npm install express sequelize pg pg-hstore cors jsonwebtoken bcryptjs mqtt --save

ENV PORT=8080
EXPOSE 8080

# CMD [ "node", "server.js" ]