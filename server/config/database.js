const express = require('express');
const router = express.Router();
var db;
var mysql = require('mysql2');

var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.getConnection(function (err, database) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  } else {
    console.log("database has been connected");
    db = database;
  }
});
module.exports = connection;