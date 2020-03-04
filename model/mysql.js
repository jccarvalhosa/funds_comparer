const mysql = require('mysql');

const config = require(`../config/config.${process.env.NODE_ENV || "dev"}`).database;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || config.host,
    user: process.env.MYSQL_USER || config.user,
    password: process.env.MYSQL_PASSWORD || config.password,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || config.connectionLimit,
    database: config.database
});

module.exports.pool = pool;
