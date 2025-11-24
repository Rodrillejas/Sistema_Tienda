// ==============================
// src/modelos/Categoria.js
// ==============================
const defineCategoria = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "uk_categorias_nombre"
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'categorias',
    timestamps: true,         // Manejo automático de createdAt y updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,          // ❌ No hay campo deleted_at, así que no se usa soft delete
    underscored: false
  });

  // 🔗 Asociación con Producto (si existe la tabla productos)
  Categoria.associate = (models) => {
    Categoria.hasMany(models.Producto, {
      foreignKey: 'id_categoria',
      as: 'productos'
    });
  };

  return Categoria;
};

module.exports = defineCategoria;
