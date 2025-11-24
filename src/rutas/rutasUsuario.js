// =========================
// RUTAS DE USUARIO
// =========================

const express = require('express');
const enrutador = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');

enrutador.post('/registrar', usuarioControlador.crearUsuario);
enrutador.post('/login', usuarioControlador.iniciarSesion);
enrutador.get('/listar', usuarioControlador.listarUsuarios);
enrutador.get('/buscar/:id_usuarios', usuarioControlador.obtenerUsuarioPorId);
enrutador.put('/actualizar/:id_usuarios', usuarioControlador.actualizarUsuario);
enrutador.delete('/eliminar/:id_usuarios', usuarioControlador.eliminarUsuario);

module.exports = enrutador;
