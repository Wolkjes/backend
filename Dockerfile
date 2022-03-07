FROM node:latest

WORKDIR /backend
COPY . /backend

RUN npm install express sequelize pg pg-hstore cors jsonwebtoken bcryptjs mqtt --save

ENV PORT=8080
EXPOSE 8080

# CMD [ "node", "server.js" ]