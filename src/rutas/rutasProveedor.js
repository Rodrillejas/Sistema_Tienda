const express = require('express');
const enrutador = express.Router();
const proveedorControlador = require('../controladores/proveedorControlador');

// 👉 Registrar un nuevo proveedor
enrutador.post('/registrar', proveedorControlador.registrarProveedor);

// 👉 Listar todos los proveedores
enrutador.get('/listar', proveedorControlador.listarProveedores);

// 👉 Buscar un proveedor por ID
enrutador.get('/buscar/:id_proveedor', proveedorControlador.obtenerProveedorPorId);

// 👉 Actualizar información del proveedor
enrutador.put('/actualizar/:id_proveedor', proveedorControlador.actualizarProveedor);

// 👉 Eliminar (soft delete) un proveedor
enrutador.delete('/eliminar/:id_proveedor', proveedorControlador.eliminarProveedor);

module.exports = enrutador;
