const mysql = require('mysql2');

// Esto lee las variables que pusiste en el panel de Render
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000 // Le damos 10 segundos para conectar
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err.message);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos de Clever Cloud!');
});

module.exports = connection;