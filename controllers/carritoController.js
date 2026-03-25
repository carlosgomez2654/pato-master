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
// Finalizar compra
exports.finalizar = async (req, res) => {
    const { metodo_pago, direccion } = req.body;

    try {
        // 1. Obtener los productos actuales del carrito
        const [carrito] = await db.query(`
            SELECT c.id_producto, c.cantidad, p.precio
            FROM carrito c
            JOIN producto p ON c.id_producto = p.id_producto
        `);

        if (carrito.length === 0) return res.send("El carrito está vacío");

        // 2. Calcular el total de la venta
        let total = 0;
        carrito.forEach(item => {
            total += item.cantidad * item.precio;
        });

        // 3. Insertar la cabecera de la compra
        const fecha = new Date();
        const [result] = await db.query(
            'INSERT INTO compra (id_proveedor, fecha_compra, total_compra, metodo_pago) VALUES (?, ?, ?, ?)',
            [null, fecha, total, metodo_pago]
        );
        const id_compra = result.insertId;

        // 4. Insertar cada producto en el detalle de la compra
        for (const item of carrito) {
            await db.query(
                'INSERT INTO compra_detalle (id_compra, id_producto, cantidad, precio_unitario_compra) VALUES (?, ?, ?, ?)',
                [id_compra, item.id_producto, item.cantidad, item.precio]
            );
        }

        // 5. Vaciar el carrito para la próxima compra
        await db.query('DELETE FROM carrito');

        // 6. REDIRECCIÓN CLAVE: Enviar a una página de confirmación
        // Cambiamos '/carrito/finalizar' por '/carrito/confirmacion'
        res.redirect('/carrito/confirmacion'); 
        
    } catch (err) {
        console.error("Error en finalizar compra:", err);
        res.status(500).send("Error al procesar la compra en el servidor");
    }
};