// db.js
const mysql = require('mysql2');
require('dotenv').config();


const createPool1 = () => {
  return mysql.createPool({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
  }).promise();
};

const createPool2 = () => {
  return mysql.createPool({
  host: process.env.DB_HOST_2,
  user: process.env.DB_USER_2,
  password: process.env.DB_PASSWORD_2,
  database: process.env.DB_NAME_2,
  port: process.env.DB_PORT_2,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
  }).promise();
};


module.exports = { createPool1, createPool2 };

