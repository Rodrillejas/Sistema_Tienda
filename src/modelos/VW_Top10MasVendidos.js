// src/modelos/VW_Top10MasVendidos.js
const defineVW_Top10MasVendidos = (sequelize, DataTypes) => {
  return sequelize.define('VW_Top10MasVendidos', {
    producto: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: true
    },
    total_vendido: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'vw_top10masvendidos', // coincide con el nombre exacto de la vista
    timestamps: false,                // las vistas no tienen created_at / updated_at
    paranoid: false,
    underscored: false,
    freezeTableName: true             // evita que Sequelize pluralice el nombre
  });
};

module.exports = defineVW_Top10MasVendidos;
