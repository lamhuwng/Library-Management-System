const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    port: '3307', 
    user: 'dev_user',
    password: 'kZ7$pQ9!mN2@vX5r',
    database: 'library_management_db'
});

module.exports = db.promise(); 