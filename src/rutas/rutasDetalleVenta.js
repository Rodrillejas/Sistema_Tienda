// =========================
// RUTAS DETALLE DE VENTA
// =========================

const express = require('express');
const enrutador = express.Router();
const detalleVentaControlador = require('../controladores/detalleVentaControlador');

// 👉 Registrar un nuevo detalle de venta
enrutador.post('/registrar', detalleVentaControlador.registrarDetalleVenta);

// 👉 Listar todos los detalles de venta
enrutador.get('/listar', detalleVentaControlador.listarDetallesVenta);

// 👉 Buscar un detalle de venta por ID
enrutador.get('/buscar/:id_ventaDetalle', detalleVentaControlador.obtenerDetalleVentaPorId);

// 👉 Actualizar un detalle de venta
enrutador.put('/actualizar/:id_ventaDetalle', detalleVentaControlador.actualizarDetalleVenta);

// 👉 Eliminar un detalle de venta
enrutador.delete('/eliminar/:id_ventaDetalle', detalleVentaControlador.eliminarDetalleVenta);

// (opcional) 👉 Listar detalles de una venta específica
// Si en tu controlador luego agregas "listarDetallesPorVenta"
if (detalleVentaControlador.listarDetallesPorVenta) {
  enrutador.get('/venta/:id_ventaDetalle', detalleVentaControlador.listarDetallesPorVenta);
}

module.exports = enrutador;
