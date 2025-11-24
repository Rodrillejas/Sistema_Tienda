// src/baseDatos/conexion.js
require('dotenv').config();
const { Sequelize,DataTypes } = require('sequelize');

const defineCategoria= require('../modelos/Categoria');
const defineCliente = require('../modelos/Cliente');
const defineConfiguracion = require('../modelos/Configuracion');
const defineDetalleVenta = require('../modelos/DetalleVenta');
const defineProducto = require('../modelos/Producto');
const defineProveedor = require('../modelos/Proveedor');
const defineRol = require('../modelos/Rol');
const defineUsuario = require('../modelos/Usuario');
const defineVenta= require('../modelos/Venta');
const defineVW_GananciasPorFecha = require('../modelos/VW_GananciasPorFecha');
const defineVW_Top10MasVendidos = require('../modelos/VW_Top10MasVendidos');
const defineVW_Top10MenosVendidos = require('../modelos/VW_Top10MenosVendidos');



// ✅ Crear la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',      // o 'mariadb', 'postgres', etc.
    logging: false         // Desactiva logs SQL en consola
  }
);

const Categoria = defineCategoria(sequelize, DataTypes);
const Cliente = defineCliente(sequelize, DataTypes);
const Configuracion = defineConfiguracion(sequelize, DataTypes);
const DetalleVenta = defineDetalleVenta(sequelize, DataTypes);
const Producto = defineProducto(sequelize, DataTypes);
const Proveedor = defineProveedor(sequelize, DataTypes);
const Rol = defineRol(sequelize, DataTypes);
const Usuario = defineUsuario(sequelize, DataTypes);
const Venta = defineVenta(sequelize, DataTypes);
const VW_GananciasPorFecha = defineVW_GananciasPorFecha(sequelize, DataTypes);
const VW_Top10MasVendidos = defineVW_Top10MasVendidos(sequelize, DataTypes);
const VW_Top10MenosVendidos = defineVW_Top10MenosVendidos(sequelize, DataTypes);

// =========================
// Asociaciones entre modelos
// =========================

// ========== PRODUCTO, CATEGORIA Y PROVEEDOR ==========

// Un producto pertenece a una categoría
Producto.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

// Una categoría tiene muchos productos
Categoria.hasMany(Producto, {
  foreignKey: 'id_categoria',
  as: 'productos'
});

// Un producto pertenece a un proveedor
Producto.belongsTo(Proveedor, {
  foreignKey: 'id_proveedor',
  as: 'proveedor'
});

// Un proveedor tiene muchos productos
Proveedor.hasMany(Producto, {
  foreignKey: 'id_proveedor',
  as: 'productos'
});


// ========== USUARIO Y ROL ==========

// Un usuario pertenece a un rol
Usuario.belongsTo(Rol, {
  foreignKey: 'id_roles',
  as: 'rol'
});

// Un rol tiene muchos usuarios
Rol.hasMany(Usuario, {
  foreignKey: 'id_roles',
  as: 'usuarios'
});


// ========== VENTA, CLIENTE Y USUARIO ==========

// Una venta pertenece a un cliente
Venta.belongsTo(Cliente, {
  foreignKey: 'id_clientes',
  as: 'cliente'
});

// Un cliente tiene muchas ventas
Cliente.hasMany(Venta, {
  foreignKey: 'id_clientes',
  as: 'ventas'
});

// Una venta pertenece a un usuario (vendedor)
Venta.belongsTo(Usuario, {
  foreignKey: 'id_usuarios',
  as: 'usuario'
});

// Un usuario puede tener muchas ventas
Usuario.hasMany(Venta, {
  foreignKey: 'id_usuarios',
  as: 'ventas'
});


// ========== DETALLEVENTA, VENTA Y PRODUCTO ==========

// Un detalle de venta pertenece a una venta
DetalleVenta.belongsTo(Venta, {
  foreignKey: 'id_ventas',
  as: 'venta'
});

// Una venta tiene muchos detalles de venta
Venta.hasMany(DetalleVenta, {
  foreignKey: 'id_ventas',
  as: 'detalles'
});

// Un detalle de venta pertenece a un producto
DetalleVenta.belongsTo(Producto, {
  foreignKey: 'id_productos',
  as: 'producto'
});

// Un producto puede estar en muchos detalles de venta
Producto.hasMany(DetalleVenta, {
  foreignKey: 'id_productos',
  as: 'detallesVenta'
});


// ========== CONFIGURACION (opcional, si es general del sistema) ==========
// Si tu tabla de configuración no tiene relación con otras, se deja sin asociaciones.





// ✅ Probar la conexión
sequelize.authenticate()
  .then(() => console.log('Conectado a la base de datos.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

sequelize.sync({ alter: true, force: false })
  .then(() => console.log('Sincronización completada.'))
  .catch(err => console.error('Error en la sincronización:', err));







// ✅ Exportar la instancia
module.exports = {
 Categoria,
 Cliente ,
 Configuracion, 
 DetalleVenta,   
 Producto,      
 Proveedor,
 Rol,     
 Usuario,     
 Venta,
 VW_GananciasPorFecha, 
 VW_Top10MasVendidos, 
 VW_Top10MenosVendidos,
 sequelize 

};
