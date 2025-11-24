const express = require('express');
const enrutador = express.Router();
const configuracionControlador = require('../controladores/configuracionControlador');

// 👉 Registrar o crear la configuración inicial de la tienda
enrutador.post('/registrar', configuracionControlador.crearConfiguracion);

// 👉 Obtener la configuración actual de la tienda
enrutador.get('/obtener', configuracionControlador.obtenerConfiguracion);

// 👉 Actualizar la configuración (nombre, logo, moneda, impuestos, etc.)
enrutador.put('/actualizar/:id', configuracionControlador.actualizarConfiguracion);

module.exports = enrutador;
