const mysql = require("mysql2");

exports.getDBConnection = function(){
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "task_db",
      password: process.env.SQL_PASSWORD
    });
}