// src/rutas/rutasVentas.js
const express = require('express');
const enrutador = express.Router();
const ventaControlador = require('../controladores/ventaControlador');

// 👉 Registrar una nueva venta
enrutador.post('/registrar', ventaControlador.registrarVenta);

// 👉 Listar todas las ventas
enrutador.get('/listar', ventaControlador.listarVentas);

// 👉 Buscar una venta por ID
enrutador.get('/buscar/:id_ventas', ventaControlador.obtenerVentaPorId);

// 👉 Actualizar una venta existente
enrutador.put('/actualizar/:id_ventas', ventaControlador.actualizarVenta);

// 👉 Anular una venta (cambiar estado a “Anulada”)
enrutador.put('/anular/:id_ventas', ventaControlador.anularVenta);

// 👉 Eliminar (borrado lógico o físico, según tu lógica)
enrutador.delete('/eliminar/:id_ventas', ventaControlador.eliminarVenta);

// 👉 Listar ventas por cliente
enrutador.get('/cliente/:id_clientes', ventaControlador.listarVentasPorCliente);

// 👉 Listar ventas por usuario (vendedor o cajero)
enrutador.get('/usuario/:id_usuarios', ventaControlador.listarVentasPorUsuario);

module.exports = enrutador;
