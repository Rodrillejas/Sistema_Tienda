const express = require('express');
const enrutador = express.Router();
const clienteControlador = require('../controladores/clienteControlador');

// 👉 Crear un nuevo cliente
enrutador.post('/registrar', clienteControlador.registrarCliente);

// 👉 Listar todos los clientes activos
enrutador.get('/listar', clienteControlador.listarClientes);

// 👉 Obtener un cliente por su ID
enrutador.get('/buscar/:id_clientes', clienteControlador.obtenerClientePorId);

// 👉 Buscar cliente por documento (mantiene nombre "cedula" en URL)
enrutador.get('/buscarPorCedula/:cedula', clienteControlador.buscarPorCedula);

// 👉 Actualizar datos de un cliente
enrutador.put('/actualizar/:id_clientes', clienteControlador.actualizarCliente);

// 👉 Eliminar (soft delete) un cliente
enrutador.delete('/eliminar/:id_clientes', clienteControlador.eliminarCliente);

module.exports = enrutador;
