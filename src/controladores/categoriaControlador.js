// ==============================
// controllers/categoriaControlador.js
// ==============================
const { Categoria } = require('../baseDatos/conexion');
const { Op } = require('sequelize');

// ==============================
// Registrar nueva categoría
// ==============================
const registrarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // 🔍 Validar duplicado
    const duplicado = await Categoria.findOne({
      where: {
        nombre,
        deleted_at: null // Solo cuenta activas o no eliminadas
      }
    });

    if (duplicado) {
      return res.status(400).json({
        mensaje: 'Ya existe una categoría con este nombre.',
        resultado: null
      });
    }

    // 🟢 Crear categoría activa por defecto
    const categoria = await Categoria.create({
      nombre,
      descripcion,
      is_active: true,
      deleted_at: null
    });

    res.status(201).json({
      mensaje: 'Categoría registrada correctamente.',
      resultado: categoria
    });
  } catch (error) {
    console.error('❌ Error al registrar categoría:', error);
    res.status(500).json({
      mensaje: 'Error al registrar la categoría.',
      resultado: error.message
    });
  }
};

// ==============================
// Listar categorías activas (no eliminadas)
// ==============================
const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: {
        is_active: true,
        deleted_at: null
      },
      order: [['id_categoria', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de categorías activas.',
      resultado: categorias
    });
  } catch (error) {
    console.error('❌ Error al listar categorías:', error);
    res.status(500).json({
      mensaje: 'Error al listar categorías.',
      resultado: error.message
    });
  }
};

// ==============================
// Actualizar categoría
// ==============================
const actualizarCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const { nombre, descripcion } = req.body;

    const categoria = await Categoria.findByPk(id_categoria);

    if (!categoria || !categoria.is_active || categoria.deleted_at !== null) {
      return res.status(404).json({
        mensaje: 'Categoría no encontrada o inactiva.',
        resultado: null
      });
    }

    // Evitar duplicados en actualización
    const duplicado = await Categoria.findOne({
      where: {
        nombre,
        id_categoria: { [Op.ne]: id_categoria },
        deleted_at: null
      }
    });

    if (duplicado) {
      return res.status(400).json({
        mensaje: 'Ya existe otra categoría con ese nombre.',
        resultado: null
      });
    }

    await categoria.update({
      nombre,
      descripcion,
      updated_at: new Date()
    });

    res.status(200).json({
      mensaje: 'Categoría actualizada correctamente.',
      resultado: categoria
    });
  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar la categoría.',
      resultado: error.message
    });
  }
};

// ==============================
// Borrado lógico (marcar como eliminada)
// ==============================
const eliminarCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const categoria = await Categoria.findByPk(id_categoria);

    if (!categoria) {
      return res.status(404).json({
        mensaje: 'Categoría no encontrada.',
        resultado: null
      });
    }

    await categoria.update({
      is_active: false,
      deleted_at: new Date()
    });

    res.status(200).json({
      mensaje: 'Categoría eliminada correctamente (borrado lógico).',
      resultado: categoria
    });
  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar la categoría.',
      resultado: error.message
    });
  }
};

// ==============================
// Obtener categoría por ID
// ==============================
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const categoria = await Categoria.findByPk(id_categoria);

    if (!categoria || !categoria.is_active || categoria.deleted_at !== null) {
      return res.status(404).json({
        mensaje: 'Categoría no encontrada o inactiva.',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Categoría encontrada.',
      resultado: categoria
    });
  } catch (error) {
    console.error('❌ Error al consultar categoría:', error);
    res.status(500).json({
      mensaje: 'Error al consultar la categoría.',
      resultado: error.message
    });
  }
};

module.exports = {
  registrarCategoria,
  listarCategorias,
  actualizarCategoria,
  eliminarCategoria,
  obtenerCategoriaPorId
};
