const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Ruta de Registro (Ya funciona)
router.route('/register')
    .get(authController.renderRegister)
    .post(authController.register);

// NUEVO: Ruta de Login
router.route('/login')
    .get(authController.renderLogin) // Para mostrar login.ejs
    .post(authController.login);      // Para validar las credenciales

module.exports = router;