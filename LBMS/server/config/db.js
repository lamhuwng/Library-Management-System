const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    port: '3307', 
    user: 'root',
    password: '',
    database: 'library_management_db'
});

module.exports = db.promise(); 