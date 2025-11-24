// src/modelos/Venta.js
const defineVenta = (sequelize, DataTypes) => {
  const Venta = sequelize.define('Venta', {
    id_ventas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_clientes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id_clientes'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    id_usuarios: {   // ✅ corregido (antes estaba mal escrito como id_usarios)
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuarios'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    impuestos: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'COMPLETADA', 'ANULADA'),
      allowNull: false,
      defaultValue: 'COMPLETADA'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'ventas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,           // ✅ se activa porque tienes "deleted_at"
    deletedAt: 'deleted_at',
    underscored: false
  });

  // 🔗 Asociaciones
  Venta.associate = (models) => {
    // Cada venta pertenece a un cliente
    Venta.belongsTo(models.Cliente, {
      foreignKey: 'id_clientes',
      as: 'cliente'
    });

    // Cada venta pertenece a un usuario (quien la registró)
    Venta.belongsTo(models.Usuario, {
      foreignKey: 'id_usuarios',
      as: 'usuario'
    });

    // Una venta tiene muchos detalles
    Venta.hasMany(models.DetalleVenta, {
      foreignKey: 'id_ventas',
      as: 'detalles'
    });
  };

  return Venta;
};

module.exports = defineVenta;
