// src/modelos/Producto.js
const defineProducto = (sequelize, DataTypes) => {
    const Producto = sequelize.define('Producto', {
        id_productos: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        sku: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: "uk_productos_sku"
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        precio: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        id_proveedor: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'proveedores',
                key: 'id_proveedor'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categorias',
                key: 'id_categoria'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
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
        tableName: 'productos',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true,         // borrado lógico activado
        deletedAt: 'deleted_at',
        underscored: false      // nombres de columnas tal cual en la BD
    });

    // 🔗 Asociaciones
    Producto.associate = (models) => {
        // Un producto pertenece a una categoría
        Producto.belongsTo(models.Categoria, {
            foreignKey: 'id_categoria',
            as: 'categoria',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Un producto pertenece a un proveedor
        Producto.belongsTo(models.Proveedor, {
            foreignKey: 'id_proveedor',
            as: 'proveedor',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Un producto puede estar en muchos detalles de venta
        Producto.hasMany(models.DetalleVenta, {
            foreignKey: 'id_productos',
            as: 'detallesVenta'
        });
    };

    return Producto;
};

module.exports = defineProducto;
