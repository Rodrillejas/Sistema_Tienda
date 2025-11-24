// src/modelos/VW_GananciasPorFecha.js
const defineVW_GananciasPorFecha = (sequelize, DataTypes) => {
  return sequelize.define('VW_GananciasPorFecha', {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    ganancia_neta: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    total_ventas: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    cantidad_ventas: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'vw_gananciasporfecha', // ✅ nombre exacto en minúsculas si MySQL lo usa así
    timestamps: false,                 // Es una vista, no usa created_at / updated_at
    paranoid: false,
    underscored: false,
    freezeTableName: true              // evita pluralización automática
  });
};

module.exports = defineVW_GananciasPorFecha;
