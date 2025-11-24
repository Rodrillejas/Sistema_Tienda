// ==============================
// src/controladores/configuracionControlador.js
// ==============================
const { Configuracion } = require('../baseDatos/conexion');

// ======================================================
// Obtener configuración del sistema
// ======================================================
const obtenerConfiguracion = async (req, res) => {
  try {
    const configuracion = await Configuracion.findByPk(1); // Solo un registro permitido

    if (!configuracion) {
      return res.status(404).json({
        mensaje: "No se encontró la configuración del sistema.",
        resultado: null
      });
    }

    return res.status(200).json({
      mensaje: "Configuración obtenida correctamente.",
      resultado: configuracion
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno al obtener la configuración.",
      resultado: error.message
    });
  }
};

// ======================================================
// Actualizar configuración del sistema
// ======================================================
const actualizarConfiguracion = async (req, res) => {
  try {
    const configuracion = await Configuracion.findByPk(1);

    if (!configuracion) {
      return res.status(404).json({
        mensaje: "No se encontró la configuración para actualizar.",
        resultado: null
      });
    }

    const { nombre_tienda, logo_url, moneda, impuestos_porcentaje } = req.body;

    // Validar porcentaje numérico
    if (
      impuestos_porcentaje !== undefined &&
      (isNaN(impuestos_porcentaje) || impuestos_porcentaje < 0)
    ) {
      return res.status(400).json({
        mensaje: "El porcentaje de impuestos debe ser un número válido y no negativo.",
        resultado: null
      });
    }

    await configuracion.update({
      nombre_tienda: nombre_tienda ?? configuracion.nombre_tienda,
      logo_url: logo_url ?? configuracion.logo_url,
      moneda: moneda ?? configuracion.moneda,
      impuestos_porcentaje:
        impuestos_porcentaje ?? configuracion.impuestos_porcentaje
    });

    return res.status(200).json({
      mensaje: "Configuración actualizada correctamente.",
      resultado: configuracion
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno al actualizar la configuración.",
      resultado: error.message
    });
  }
};

// ======================================================
// Crear configuración inicial (solo si no existe)
// ======================================================
const crearConfiguracion = async (req, res) => {
  try {
    const existente = await Configuracion.findByPk(1);

    if (existente) {
      return res.status(400).json({
        mensaje: "Ya existe una configuración registrada. Solo se permite una.",
        resultado: existente
      });
    }

    const { nombre_tienda, logo_url, moneda, impuestos_porcentaje } = req.body;

    // Validaciones
    if (!nombre_tienda) {
      return res.status(400).json({
        mensaje: "El campo 'nombre_tienda' es obligatorio.",
        resultado: null
      });
    }

    if (
      impuestos_porcentaje !== undefined &&
      (isNaN(impuestos_porcentaje) || impuestos_porcentaje < 0)
    ) {
      return res.status(400).json({
        mensaje: "El campo 'impuestos_porcentaje' debe ser un número válido y no negativo.",
        resultado: null
      });
    }

    const nuevaConfiguracion = await Configuracion.create({
      id: 1,
      nombre_tienda,
      logo_url: logo_url || null,
      moneda: moneda || 'COP',
      impuestos_porcentaje: impuestos_porcentaje || 0.0
    });

    return res.status(201).json({
      mensaje: "Configuración creada correctamente.",
      resultado: nuevaConfiguracion
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno al crear la configuración.",
      resultado: error.message
    });
  }
};

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  crearConfiguracion
};
