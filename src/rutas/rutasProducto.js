const express = require('express');
const enrutador = express.Router();
const productoControlador = require('../controladores/productoControlador');

// 👉 Registrar un nuevo producto
enrutador.post('/registrar', productoControlador.registrarProducto);

// 👉 Listar todos los productos
enrutador.get('/listar', productoControlador.listarProductos);

// 👉 Buscar un producto por ID
enrutador.get('/buscar/:id_productos', productoControlador.obtenerProductoPorId);

// 👉 Actualizar información de un producto
enrutador.put('/actualizar/:id_productos', productoControlador.actualizarProducto);

// 👉 Eliminar (soft delete) un producto
enrutador.delete('/eliminar/:id_productos', productoControlador.eliminarProducto);

// 👉 Listar productos por categoría
enrutador.get('/categoria/:id_categoria', productoControlador.listarProductosPorCategoria);

// 👉 Listar productos por proveedor
enrutador.get('/proveedor/:id_proveedor', productoControlador.listarProductosPorProveedor);

module.exports = enrutador;
