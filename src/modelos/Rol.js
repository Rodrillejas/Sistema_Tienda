// ==============================
// src/modelos/Rol.js
// ==============================
module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define(
    'Rol',
    {
      id_roles: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: "uk_roles_nombre"
      },
      descripcion: {
        type: DataTypes.STRING(255),
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
    },
    {
      tableName: 'roles',
      timestamps: true,        // Sequelize maneja createdAt / updatedAt
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false,
      underscored: false
    }
  );

  // 🔗 Asociación con Usuario
  Rol.associate = (models) => {
    Rol.hasMany(models.Usuario, {
      foreignKey: 'id_roles', // Debe coincidir con la columna real en la tabla usuarios
      as: 'usuarios'
    });
  };

  return Rol;
};
