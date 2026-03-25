const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/menu', productoController.mostrarMenu);

module.exports = router;