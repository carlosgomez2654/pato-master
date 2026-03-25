const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.post('/carrito/agregar', carritoController.agregar);       // ya lo tienes
router.get('/carrito', carritoController.ver);                    // ver carrito
router.post('/carrito/finalizar', carritoController.finalizar);   // finalizar compra

module.exports = router;