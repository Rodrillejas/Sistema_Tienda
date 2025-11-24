// src/controladores/reporteControlador.js
const { Op } = require('sequelize');
const { 
  VW_GananciasPorFecha, 
  VW_Top10MasVendidos, 
  VW_Top10MenosVendidos 
} = require('../baseDatos/conexion');

/* ================================================================
   📊 GANANCIAS POR FECHA
   Vista: vw_gananciasporfecha
   Endpoint: GET /api/reportes/gananciasPorFecha?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
================================================================ */
const gananciasPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const where = {};

    if (fechaInicio && fechaFin) {
      where.fecha = { [Op.between]: [fechaInicio, fechaFin] };
    } else if (fechaInicio) {
      where.fecha = { [Op.gte]: fechaInicio };
    } else if (fechaFin) {
      where.fecha = { [Op.lte]: fechaFin };
    }

    const datos = await VW_GananciasPorFecha.findAll({
      where,
      order: [['fecha', 'DESC']]
    });

    return res.status(200).json({
      mensaje: 'Ganancias obtenidas correctamente.',
      total_registros: datos.length,
      resultado: datos
    });
  } catch (error) {
    console.error('Error en gananciasPorFecha:', error);
    return res.status(500).json({
      mensaje: 'Error al obtener las ganancias.',
      resultado: error.message
    });
  }
};

/* ================================================================
   🏆 TOP 10 MÁS VENDIDOS
   Vista: vw_top10masvendidos
   Endpoint: GET /api/reportes/top10MasVendidos
================================================================ */
const top10MasVendidos = async (req, res) => {
  try {
    const datos = await VW_Top10MasVendidos.findAll({
      order: [['total_vendido', 'DESC']],
      limit: 10
    });

    return res.status(200).json({
      mensaje: 'Top 10 productos más vendidos obtenidos correctamente.',
      total_registros: datos.length,
      resultado: datos
    });
  } catch (error) {
    console.error('Error en top10MasVendidos:', error);
    return res.status(500).json({
      mensaje: 'Error al obtener el Top 10 de productos más vendidos.',
      resultado: error.message
    });
  }
};

/* ================================================================
   💤 TOP 10 MENOS VENDIDOS
   Vista: vw_top10menosvendidos
   Endpoint: GET /api/reportes/top10MenosVendidos
================================================================ */
const top10MenosVendidos = async (req, res) => {
  try {
    const datos = await VW_Top10MenosVendidos.findAll({
      order: [['total_vendido', 'ASC']],
      limit: 10
    });

    return res.status(200).json({
      mensaje: 'Top 10 productos menos vendidos obtenidos correctamente.',
      total_registros: datos.length,
      resultado: datos
    });
  } catch (error) {
    console.error('Error en top10MenosVendidos:', error);
    return res.status(500).json({
      mensaje: 'Error al obtener el Top 10 de productos menos vendidos.',
      resultado: error.message
    });
  }
};

module.exports = {
  gananciasPorFecha,
  top10MasVendidos,
  top10MenosVendidos
};
