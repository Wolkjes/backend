const db_pass = process.env['db_pass'];
const BASE = process.env['BASE'];

module.exports = {
  HOST: BASE,
  PORT: "5438",
  USER: "wolkje",
  PASSWORD: db_pass,
  DB: "wolkje",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};