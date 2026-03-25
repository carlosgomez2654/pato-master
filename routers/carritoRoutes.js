const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.post('/carrito/agregar', carritoController.agregar);       // ya lo tienes
router.get('/carrito', carritoController.ver);                    // ver carrito
router.post('/carrito/finalizar', carritoController.finalizar);   // finalizar compra
router.get('/carrito/exito', (req, res) => {
    res.send(`
        <h1>¡Compra realizada con éxito!</h1>
        <p>Tu pedido ha sido registrado en el sistema del restaurante Pato.</p>
        <a href="/menu">Volver al Menú</a>
    `);
});

module.exports = router;