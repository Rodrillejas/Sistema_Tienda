// src/modelos/DetalleVenta.js
const defineDetalleVenta = (sequelize, DataTypes) => {
  const DetalleVenta = sequelize.define('DetalleVenta', {
    id_ventaDetalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_ventas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ventas',
        key: 'id_ventas'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    id_productos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id_productos'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'venta_detalle',
    timestamps: true,           // ✅ necesario para mapear created_at correctamente
    createdAt: 'created_at',    // ✅ mapeo al campo SQL
    updatedAt: false,           // ✅ la tabla no tiene updated_at
    paranoid: false,            // no hay deleted_at
    underscored: false
  });

  // 🔗 Asociaciones
  DetalleVenta.associate = (models) => {
    // Cada detalle pertenece a una venta
    DetalleVenta.belongsTo(models.Venta, {
      foreignKey: 'id_ventas',
      as: 'venta'
    });

    // Cada detalle pertenece a un producto
    DetalleVenta.belongsTo(models.Producto, {
      foreignKey: 'id_productos',
      as: 'producto'
    });
  };

  return DetalleVenta;
};

module.exports = defineDetalleVenta;
