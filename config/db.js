const mysql = require('mysql2/promise');
require('dotenv').config(); // Asegúrate de que esto esté para leer el .env

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pato',
    port: process.env.DB_PORT || 3306, // <-- Agregamos el puerto
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Descomenta la línea de abajo solo si Railway o TiDB te piden SSL
    // ssl: { rejectUnauthorized: false } 
});

module.exports = pool;