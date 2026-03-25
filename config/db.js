const mysql = require('mysql2/promise'); // <--- IMPORTANTE: /promise

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pato',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;