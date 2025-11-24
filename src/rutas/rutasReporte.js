// src/rutas/reporteRutas.js
const express = require('express');
const router = express.Router();
const reporteControlador = require('../controladores/reporteControlador');

// Rutas públicas para reportes
router.get('/gananciasPorFecha', reporteControlador.gananciasPorFecha);
router.get('/top10MasVendidos', reporteControlador.top10MasVendidos);
router.get('/top10MenosVendidos', reporteControlador.top10MenosVendidos);

module.exports = router;
