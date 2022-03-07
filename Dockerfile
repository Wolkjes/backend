FROM node:latest

RUN mkdir -p /app/backend
WORKDIR /app/backend/
COPY package*.json /app/backend/

RUN npm install express sequelize pg pg-hstore cors jsonwebtoken bcryptjs mqtt --save

COPY . /app/backend/

ENV PORT=8080
EXPOSE 8080