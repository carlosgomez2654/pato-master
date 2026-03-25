const express = require('express');
const path = require('path');
const session = require('express-session');
const reservaController = require('./controllers/reservaController');

const app = express();

// --- 1. CONFIGURACIÓN DE VISTAS ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- 2. MIDDLEWARES (ORDEN IMPORTANTE) ---
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Sesión (Debe ir ANTES de las rutas)
app.use(session({
    secret: 'secreto_restaurante_pato_2026', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambiar a true si usas HTTPS algún día
        maxAge: 3600000 // La sesión dura 1 hora
    }
}));

// --- 3. RUTAS DE AUTENTICACIÓN (Login/Registro) ---
const authRoutes = require('./routers/authRoutes');
app.use('/', authRoutes); 

// --- 3. RUTAS DE PRODUCTOS ---
const productoRoutes = require('./routers/productoRoutes');
app.use('/', productoRoutes);

const carritoRoutes = require('./routers/carritoRoutes');
app.use('/', carritoRoutes);

// --- 4. RUTAS PÚBLICAS (Cualquiera las ve) ---
app.get('/', (req, res) => res.render('index'));
app.get('/menu', (req, res) => res.render('menu'));
app.get('/galeria', (req, res) => res.render('gallery'));
app.get('/nosotros', (req, res) => res.render('about'));
app.get('/blog', (req, res) => res.render('blog'));
app.get('/contacto', (req, res) => res.render('contact'));
app.post('/confirmar-reserva', reservaController.crearReserva);

// --- 5. RUTAS PROTEGIDAS POR ROL (Tu lógica de restaurante) ---

// Solo para el Administrador
app.get('/admin_dashboard', (req, res) => {
    if (req.session.rol === 'admin') {
        res.render('admin_view'); 
    } else {
        res.redirect('/login');
    }
});

// Solo para el Cajero
app.get('/cajero_dashboard', (req, res) => {
    if (req.session.rol === 'cajero') {
        res.render('cajero_view');
    } else {
        res.redirect('/login');
    }
});

// Solo para Clientes (Domicilios y Reservas)
// Ruta de Domicilios: Cliente y Admin pueden entrar
app.get('/domicilios', (req, res) => {
    if (req.session.rol === 'cliente' || req.session.rol === 'admin') {
        res.render('domicilios', { nombre: req.session.nombre });
    } else {
        res.redirect('/login');
    }
});
// Cambia 'reservation' por 'reservacion'
app.get('/reservacion', (req, res) => {
    if (req.session.rol === 'cliente' || req.session.rol === 'admin') {
        res.render('reservation', { nombre: req.session.nombre });
    } else {
        res.redirect('/login');
    }
});
// --- 6. CIERRE DE SESIÓN ---
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const puerto = process.env.PORT || 2000;
app.listen(puerto, () => {
    console.log(`El servidor esta escuchando en http://localhost:${puerto}`);
});