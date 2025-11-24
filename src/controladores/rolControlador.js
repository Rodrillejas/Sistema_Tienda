// =========================
// controllers/rolControlador.js
// =========================
const { Rol } = require('../baseDatos/conexion');

// =========================
// Crear un nuevo rol
// =========================
const crearRol = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validar campos obligatorios
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        mensaje: 'El nombre del rol es obligatorio.',
        resultado: null
      });
    }

    // Validar duplicado
    const existente = await Rol.findOne({ where: { nombre } });
    if (existente) {
      return res.status(400).json({
        mensaje: 'Ya existe un rol con ese nombre.',
        resultado: null
      });
    }

    // Crear rol
    const rol = await Rol.create({ nombre, descripcion });

    return res.status(201).json({
      mensaje: 'Rol creado correctamente.',
      resultado: rol
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al crear rol.',
      resultado: error.message
    });
  }
};

// =========================
// Listar todos los roles
// =========================
const listarRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll({
      order: [['id_roles', 'ASC']]
    });

    return res.status(200).json({
      mensaje: 'Lista de roles obtenida correctamente.',
      resultado: roles
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al listar roles.',
      resultado: error.message
    });
  }
};

// =========================
// Obtener un rol por ID
// =========================
const obtenerRolPorId = async (req, res) => {
  try {
    const { id_roles } = req.params;

    const rol = await Rol.findByPk(id_roles);
    if (!rol) {
      return res.status(404).json({
        mensaje: 'Rol no encontrado.',
        resultado: null
      });
    }

    return res.status(200).json({
      mensaje: 'Rol encontrado correctamente.',
      resultado: rol
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al obtener rol.',
      resultado: error.message
    });
  }
};

// =========================
// Actualizar rol
// =========================
const actualizarRol = async (req, res) => {
  try {
    const { id_roles } = req.params;
    const { nombre, descripcion } = req.body;

    const rol = await Rol.findByPk(id_roles);
    if (!rol) {
      return res.status(404).json({
        mensaje: 'Rol no encontrado.',
        resultado: null
      });
    }

    // Validar duplicado de nombre si cambia
    if (nombre && nombre !== rol.nombre) {
      const duplicado = await Rol.findOne({ where: { nombre } });
      if (duplicado) {
        return res.status(400).json({
          mensaje: 'Ya existe otro rol con ese nombre.',
          resultado: null
        });
      }
    }

    await rol.update({ nombre, descripcion });

    return res.status(200).json({
      mensaje: 'Rol actualizado correctamente.',
      resultado: rol
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar rol.',
      resultado: error.message
    });
  }
};

// =========================
// Eliminar rol (borrado físico)
// =========================
const eliminarRol = async (req, res) => {
  try {
    const { id_roles } = req.params;

    const rol = await Rol.findByPk(id_roles);
    if (!rol) {
      return res.status(404).json({
        mensaje: 'Rol no encontrado.',
        resultado: null
      });
    }

    await rol.destroy();

    return res.status(200).json({
      mensaje: 'Rol eliminado correctamente.',
      resultado: rol
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar rol.',
      resultado: error.message
    });
  }
};

// =========================
// Exportar controladores
// =========================
module.exports = {
  crearRol,
  listarRoles,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol
};
