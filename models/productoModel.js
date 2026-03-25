const db = require('../config/db');

const obtenerProductos = async () => {
    try {
        const [rows] = await db.query(`
            SELECT p.id_producto, p.nombre_prod, p.precio, c.nombre_cat
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            ORDER BY c.id_categoria, p.nombre_prod
        `);
        return rows;
    } catch (err) {
        console.error("ERROR EN CONSULTA PRODUCTOS:", err);
        throw err; // para que el controlador vea el error
    }
};

module.exports = { obtenerProductos };