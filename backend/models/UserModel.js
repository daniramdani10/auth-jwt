const Sequelize = require("sequelize");
const db = require("../config/Database.js");

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.TEXT,
  },
  {
    freezeTableName: true,
  }
);
module.exports = Users;
