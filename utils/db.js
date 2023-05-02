const MysqlDb = require("./db.control.js")

const db = new MysqlDb({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

module.exports = db;