// src/modelos/Cliente.js
const defineCliente = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        id_clientes: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        tipo_documento: {
            type: DataTypes.STRING(20),
            allowNull: true,       // ✅ en la tabla no está NOT NULL
            defaultValue: 'CC'
        },
        documento: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: "uk_clientes_documento"
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
            unique: "uk_clientes_correo",
            validate: {
                isEmail: true
            }
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
        tableName: 'clientes',
        timestamps: true,          // Sequelize gestiona created_at y updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,            // ✅ coincide con el uso de deleted_at
        deletedAt: 'deleted_at',
        underscored: false
    });

    // 🔗 Relaciones (se agregan si hay ventas o reservas)
    Cliente.associate = (models) => {
        // Un cliente puede tener muchas ventas
        Cliente.hasMany(models.Venta, {
            foreignKey: 'id_clientes',
            as: 'ventas'
        });
    };

    return Cliente;
};

module.exports = defineCliente;
