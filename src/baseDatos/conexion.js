// src/baseDatos/conexion.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const defineCategoria = require('../modelos/Categoria');
const defineCliente = require('../modelos/Cliente');
const defineConfiguracion = require('../modelos/Configuracion');
const defineDetalleVenta = require('../modelos/DetalleVenta');
const defineProducto = require('../modelos/Producto');
const defineProveedor = require('../modelos/Proveedor');
const defineRol = require('../modelos/Rol');
const defineUsuario = require('../modelos/Usuario');
const defineVenta = require('../modelos/Venta');
const defineVW_GananciasPorFecha = require('../modelos/VW_GananciasPorFecha');
const defineVW_Top10MasVendidos = require('../modelos/VW_Top10MasVendidos');
const defineVW_Top10MenosVendidos = require('../modelos/VW_Top10MenosVendidos');


// ✅ Crear conexión compatible con Railway
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);


// 📌 Inicializar modelos
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

// PRODUCTO - CATEGORIA - PROVEEDOR
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });

Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor', as: 'productos' });

// USUARIO - ROL
Usuario.belongsTo(Rol, { foreignKey: 'id_roles', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'id_roles', as: 'usuarios' });

// VENTA - CLIENTE - USUARIO
Venta.belongsTo(Cliente, { foreignKey: 'id_clientes', as: 'cliente' });
Cliente.hasMany(Venta, { foreignKey: 'id_clientes', as: 'ventas' });

Venta.belongsTo(Usuario, { foreignKey: 'id_usuarios', as: 'usuario' });
Usuario.hasMany(Venta, { foreignKey: 'id_usuarios', as: 'ventas' });

// DETALLEVENTA - VENTA - PRODUCTO
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_ventas', as: 'venta' });
Venta.hasMany(DetalleVenta, { foreignKey: 'id_ventas', as: 'detalles' });

DetalleVenta.belongsTo(Producto, { foreignKey: 'id_productos', as: 'producto' });
Producto.hasMany(DetalleVenta, { foreignKey: 'id_productos', as: 'detallesVenta' });


// =========================
// Conexión y sincronización
// =========================

sequelize.authenticate()
  .then(() => console.log('✔ Conexión exitosa a la base de datos.'))
  .catch(err => console.error('❌ Error al conectar con la base de datos:', err));

sequelize.sync({ alter: false, force: false })
  .then(() => console.log('✔ Modelos sincronizados.'))
  .catch(err => console.error('❌ Error al sincronizar modelos:', err));


// Exportar
module.exports = {
  Categoria,
  Cliente,
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
