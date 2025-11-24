const express = require('express');
const enrutador = express.Router();
const rolControlador = require('../controladores/rolControlador');

// 👉 Registrar un nuevo rol
enrutador.post('/registrar', rolControlador.crearRol);

// 👉 Listar todos los roles
enrutador.get('/listar', rolControlador.listarRoles);

// 👉 Buscar un rol por ID
enrutador.get('/buscar/:id_roles', rolControlador.obtenerRolPorId);

// 👉 Actualizar información de un rol
enrutador.put('/actualizar/:id_roles', rolControlador.actualizarRol);

// 👉 Eliminar (soft delete) un rol
enrutador.delete('/eliminar/:id_roles', rolControlador.eliminarRol);

module.exports = enrutador;
