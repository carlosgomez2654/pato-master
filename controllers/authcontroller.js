const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// 1. Función para mostrar el formulario (GET)
exports.renderRegister = (req, res) => {
    res.render('form_register'); 
};

exports.renderLogin = (req, res) => {
    res.render('login');
};

// 2. Función para procesar el registro (POST)
exports.register = async (req, res) => {
    // Extraemos los datos que vienen del formulario (req.body)
    const { nombre_user, correo, clave } = req.body;

    try {
        // LLAMADA AL MODELO: Aquí es donde ocurre la magia
        // Solo le pasamos los datos, el Modelo se encarga del resto
        await User.create(nombre_user, correo, clave);

        // Si todo sale bien, lo mandamos al login
        console.log('Usuario creado con éxito');
        res.redirect('/login');

    } catch (error) {
        // Si hay un error (ej: correo duplicado), cae aquí
        console.error('Error al registrar usuario:', error);
        
        // Opcional: Podrías mandar un mensaje de error a la vista
        res.status(500).send('Hubo un error al procesar tu registro.');
    }
};

// 4. NUEVO: Función para procesar el login (POST)
// Esta es la que te faltaba y por la que el servidor no arranca
exports.login = async (req, res) => {
    const { nombre, clave } = req.body;

    try {
        const user = await User.findByName(nombre);

        if (user) {
            const match = await bcrypt.compare(clave, user.clave);

            if (match) {
                // GUARDAMOS LOS DATOS EN LA SESIÓN
                req.session.user_id = user.id_usuario;
                req.session.rol = user.rol;
                req.session.nombre = user.nombre_user;

                // TU LÓGICA DE REDIRECCIÓN (Traducida de Python)
                if (user.rol === 'admin') {
                    return res.redirect('/admin_dashboard');
                } else if (user.rol === 'cajero') {
                    return res.redirect('/cajero_dashboard');
                } else {
                    return res.redirect('/reservacion'); // Rol: cliente
                }
            }
        }
        res.send('Correo o contraseña incorrectos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

