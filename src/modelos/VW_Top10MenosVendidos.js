// src/modelos/VW_Top10MenosVendidos.js
const defineVW_Top10MenosVendidos = (sequelize, DataTypes) => {
  return sequelize.define('VW_Top10MenosVendidos', {
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
    tableName: 'vw_top10menosvendidos', // nombre exacto de la vista en MySQL
    timestamps: false,                  // no tiene created_at / updated_at
    paranoid: false,
    underscored: false,
    freezeTableName: true               // evita pluralización automática
  });
};

module.exports = defineVW_Top10MenosVendidos;
