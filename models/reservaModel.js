const db = require('../config/db'); 
const bcrypt = require('bcrypt');

const Reserva = {
    create: async (datos) => {
        const { id_cliente, nombre, correo, telefono, fecha, hora, personas } = datos;
        try {
            const query = `
                INSERT INTO reservas (id_cliente, nombre, correo, telefono, fecha, hora, personas, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente')
            `;
            const [result] = await db.execute(query, [
                id_cliente || null, // Puede ser null si no está logueado
                nombre, 
                correo, 
                telefono, 
                fecha, 
                hora, 
                personas
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
module.exports = Reserva;