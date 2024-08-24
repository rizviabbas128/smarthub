require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.HOST, // or your MySQL server host
  user: process.env.USER,      // your MySQL username
  password: process.env.PASSWORD, // your MySQL password
  database: process.env.DATABASE // your database name
});

// Promisify for Node.js async/await.
const promisePool = pool.promise();

module.exports = promisePool;
