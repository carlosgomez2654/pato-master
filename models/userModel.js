const db = require('../config/db'); 
const bcrypt = require('bcrypt');
const User = {
    create: async (nombre, correo, password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(password, salt);
            const query = 'INSERT INTO usuario (nombre_user, correo, clave, rol) VALUES (?, ?, ?, ?)';
            const [result] = await db.execute(query, [nombre, correo, hashed_password, 'cliente']);
            return result;
        } catch (error) {
            throw error;
        }
    },
    findByName: async (nombre) => {
        try {
            // Buscamos en la columna nombre_user (que es la que tienes en tu tabla)
            const query = 'SELECT * FROM usuario WHERE nombre_user = ?';
            const [rows] = await db.execute(query, [nombre]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }
};
module.exports = User;
