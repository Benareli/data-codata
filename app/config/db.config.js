module.exports = {
  HOST: "localhost",
  PORT: 27017,
  DB: "codata",
  USER: "codata",
  PASSWORD: "codata",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};