require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));


// 📂 Importar rutas (AJUSTADO PARA PRODUCCIÓN)
const clienteRutas = require('./src/rutas/rutasClientes');
const proveedorRutas = require('./src/rutas/rutasProveedor');
const categoriaRutas = require('./src/rutas/rutasCategoria');
const productoRutas = require('./src/rutas/rutasProducto');
const ventaRutas = require('./src/rutas/rutasVenta');
const detalleVentaRutas = require('./src/rutas/rutasDetalleVenta');
const rolRutas = require('./src/rutas/rutasRol');
const usuarioRutas = require('./src/rutas/rutasUsuario');
const configuracionRutas = require('./src/rutas/rutasConfiguracion');
const reporteRutas = require('./src/rutas/rutasReporte');
const authRutas = require('./src/rutas/rutasAuth');


// 🛣️ Rutas principales
app.use('/api/clientes', clienteRutas);
app.use('/api/proveedores', proveedorRutas);
app.use('/api/categorias', categoriaRutas);
app.use('/api/productos', productoRutas);
app.use('/api/ventas', ventaRutas);
app.use('/api/compras', ventaRutas); // <- si compras usa ventas
app.use('/api/detalleVenta', detalleVentaRutas);
app.use('/api/roles', rolRutas);
app.use('/api/usuarios', usuarioRutas);
app.use('/api/configuracion', configuracionRutas);
app.use('/api/reportes', reporteRutas);
app.use('/api/auth', authRutas);


// 🚀 Servidor en ejecución
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
