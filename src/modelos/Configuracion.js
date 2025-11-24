// src/modelos/Configuracion.js
const defineConfiguracion = (sequelize, DataTypes) => {
    const Configuracion = sequelize.define('Configuracion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            defaultValue: 1 // ✅ Solo un registro, controlado desde el backend
        },
        nombre_tienda: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        logo_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        moneda: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'COP'
        },
        impuestos_porcentaje: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00
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
        tableName: 'configuracion',
        timestamps: true,         // ✅ activa created_at y updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: false,          // no hay borrado lógico
        underscored: false
    });

    return Configuracion;
};

module.exports = defineConfiguracion;
