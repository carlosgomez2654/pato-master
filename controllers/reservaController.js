const Reserva = require('../models/reservaModel');

exports.crearReserva = async (req, res) => {
    try {
        // Extraemos los datos del formulario (los 'name' de los inputs)
        const datosReserva = {
            id_cliente: req.session.id_cliente, // Tomamos el ID de la sesión
            nombre: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            fecha: req.body.fecha,
            hora: req.body.hora,
            personas: req.body.personas
        };

        await Reserva.create(datosReserva);
        
        // Redirigir con un mensaje de éxito (puedes usar una alerta después)
        res.send('<script>alert("Reserva confirmada con éxito"); window.location.href="/reservacion";</script>');
    } catch (error) {
        console.error("Error al reservar:", error);
        res.status(500).send("Hubo un error al procesar tu reserva.");
    }
};