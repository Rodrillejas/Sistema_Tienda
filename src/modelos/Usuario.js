// ==============================
// src/modelos/Usuario.js
// ==============================
const defineUsuario = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuarios: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "uk_usuarios_username"
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    id_roles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id_roles'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,         // Sequelize manejará createdAt / updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,           // ✅ Usa soft delete (mapea deleted_at)
    deletedAt: 'deleted_at',
    underscored: false
  });

  // 🔗 Asociación con Rol
  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Rol, {
      foreignKey: 'id_roles',   // ✅ Coincide con la tabla
      as: 'rol'
    });
  };

  return Usuario;
};

module.exports = defineUsuario;
