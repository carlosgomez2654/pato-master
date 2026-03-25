const productoModel = require('../models/productoModel');

exports.mostrarMenu = async (req, res) => {
    try {
        console.log("Intentando obtener productos...");
        const productos = await productoModel.obtenerProductos();
        console.log("Productos obtenidos:", productos.length);
        res.render('menu', { productos });
    } catch (err) {
        console.error("ERROR CONTROLADOR:", err);
        res.status(500).send("Error al traer productos");
    }
};