const express = require('express');
const enrutador = express.Router();
const categoriaControlador = require('../controladores/categoriaControlador');

// 👉 Registrar una nueva categoría
enrutador.post('/registrar', categoriaControlador.registrarCategoria);

// 👉 Listar todas las categorías
enrutador.get('/listar', categoriaControlador.listarCategorias);

// 👉 Buscar una categoría por ID
enrutador.get('/buscar/:id_categoria', categoriaControlador.obtenerCategoriaPorId);

// 👉 Actualizar una categoría existente
enrutador.put('/actualizar/:id_categoria', categoriaControlador.actualizarCategoria);

// 👉 Eliminar (soft delete) una categoría
enrutador.delete('/eliminar/:id_categoria', categoriaControlador.eliminarCategoria);

module.exports = enrutador;
