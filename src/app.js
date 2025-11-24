require('dotenv').config();


const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));



// 📂 Importar rutas
const clienteRutas = require('./rutas/rutasClientes');
const proveedorRutas = require('./rutas/rutasProveedor');
const categoriaRutas = require('./rutas/rutasCategoria');
const productoRutas = require('./rutas/rutasProducto');
const ventaRutas = require('./rutas/rutasVenta');
const detalleVentaRutas = require('./rutas/rutasDetalleVenta');
const rolRutas = require('./rutas/rutasRol');
const usuarioRutas = require('./rutas/rutasUsuario');
const configuracionRutas = require('./rutas/rutasConfiguracion');
const reporteRutas = require('./rutas/rutasReporte');
const authRutas = require('./rutas/rutasAuth');



// 🛣️ Rutas principales

app.use('/api/clientes', clienteRutas);
app.use('/api/proveedores', proveedorRutas);
app.use('/api/categorias', categoriaRutas);
app.use('/api/productos', productoRutas);
app.use('/api/ventas', ventaRutas);
app.use('/api/compras', ventaRutas);
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
