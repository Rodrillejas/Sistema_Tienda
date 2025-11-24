// ==============================
// src/modelos/Proveedor.js
// ==============================
const defineProveedor = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define('Proveedor', {
    id_proveedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "uk_proveedores_nit"
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: "uk_proveedores_correo",
      validate: { isEmail: true }
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
    tableName: 'proveedores',
    timestamps: true,           // Sequelize gestionará createdAt y updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,             // ✅ Activa el borrado lógico
    deletedAt: 'deleted_at',    // ✅ Mapea correctamente la columna
    underscored: false
  });

  // 🔗 Asociación (si luego hay productos que dependen del proveedor)
  Proveedor.associate = (models) => {
    Proveedor.hasMany(models.Producto, {
      foreignKey: 'id_proveedor',
      as: 'productos'
    });
  };

  return Proveedor;
};

module.exports = defineProveedor;
