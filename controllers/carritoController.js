// controllers/carritoController.js
const db = require('../config/db');

// Ver carrito
exports.ver = async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT c.id, p.nombre_prod, p.precio, c.cantidad
            FROM carrito c
            JOIN producto p ON c.id_producto = p.id_producto
        `);

        // Calcular total
        let total = 0;
        productos.forEach(p => {
            total += p.precio * p.cantidad;
        });

        res.render('carrito', { productos, total });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al mostrar carrito");
    }
};

// Agregar producto al carrito
exports.agregar = async (req, res) => {
    const { id_producto, cantidad } = req.body;

    try {
        // Revisar si ya está en el carrito
        const [rows] = await db.query('SELECT id, cantidad FROM carrito WHERE id_producto = ?', [id_producto]);

        if (rows.length > 0) {
            const nuevaCantidad = rows[0].cantidad + cantidad;
            await db.query('UPDATE carrito SET cantidad = ? WHERE id_producto = ?', [nuevaCantidad, id_producto]);
        } else {
            await db.query('INSERT INTO carrito (id_producto, cantidad) VALUES (?, ?)', [id_producto, cantidad]);
        }

        res.send("Producto agregado al carrito correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al agregar producto al carrito");
    }
};

// Finalizar compra
exports.finalizar = async (req, res) => {
    const { metodo_pago, direccion } = req.body;

    try {
        // Obtener carrito
        const [carrito] = await db.query(`
            SELECT c.id_producto, c.cantidad, p.precio
            FROM carrito c
            JOIN producto p ON c.id_producto = p.id_producto
        `);

        if (carrito.length === 0) return res.send("Carrito vacío");

        // Calcular total
        let total = 0;
        carrito.forEach(item => {
            total += item.cantidad * item.precio;
        });

        // Insertar en compra
        const fecha = new Date();
        const [result] = await db.query(
            'INSERT INTO compra (id_proveedor, fecha_compra, total_compra, metodo_pago) VALUES (?, ?, ?, ?)',
            [null, fecha, total, metodo_pago]
        );
        const id_compra = result.insertId;

        // Insertar en compra_detalle
        for (const item of carrito) {
            await db.query(
                'INSERT INTO compra_detalle (id_compra, id_producto, cantidad, precio_unitario_compra) VALUES (?, ?, ?, ?)',
                [id_compra, item.id_producto, item.cantidad, item.precio]
            );
        }

        // Limpiar carrito
        await db.query('DELETE FROM carrito');

        res.send("Compra finalizada correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al finalizar compra");
    }
};