const sequelize = require("sequelize");

const db = new sequelize("auth_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
