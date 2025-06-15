const mysql = require('mysql2/promise');
const config = require('../../config.json');

module.exports = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME
});