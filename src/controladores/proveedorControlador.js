// ==============================
// controllers/proveedorControlador.js
// ==============================
const { Proveedor, Producto } = require('../baseDatos/conexion');
const { Op } = require('sequelize');

// =========================
// Registrar nuevo proveedor
// =========================
const registrarProveedor = async (req, res) => {
  try {
    const { nombre, nit, direccion, telefono, correo } = req.body;

    // Validar campos obligatorios
    if (!nombre || !nit) {
      return res.status(400).json({
        mensaje: 'El nombre y el NIT son obligatorios.',
        resultado: null
      });
    }

    // Validar formato del correo (si existe)
    if (correo && !correo.includes('@')) {
      return res.status(400).json({
        mensaje: 'El correo electrónico no es válido.',
        resultado: null
      });
    }

    // Validar duplicados (por NIT o correo)
    const duplicado = await Proveedor.findOne({
      where: {
        [Op.or]: [
          { nit },
          correo ? { correo } : {}
        ]
      }
    });

    if (duplicado) {
      return res.status(400).json({
        mensaje: 'El proveedor con este NIT o correo ya está registrado.',
        resultado: null
      });
    }

    // Crear proveedor
    const proveedor = await Proveedor.create({
      nombre,
      nit,
      direccion,
      telefono,
      correo,
      is_active: true
    });

    res.status(201).json({
      mensaje: 'Proveedor registrado correctamente.',
      resultado: proveedor
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar proveedor.',
      resultado: error.message
    });
  }
};

// =========================
// Listar proveedores activos
// =========================
const listarProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({
      where: { is_active: true },
      include: [
        {
          model: Producto,
          as: 'productos',
          attributes: ['id_productos', 'nombre', 'precio', 'stock'],
          required: false
        }
      ],
      order: [['id_proveedor', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de proveedores activos obtenida correctamente.',
      resultado: proveedores
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar proveedores.',
      resultado: error.message
    });
  }
};

// =========================
// Consultar proveedor por ID
// =========================
const obtenerProveedorPorId = async (req, res) => {
  try {
    const { id_proveedor } = req.params;

    const proveedor = await Proveedor.findByPk(id_proveedor, {
      include: [
        {
          model: Producto,
          as: 'productos',
          attributes: ['id_productos', 'nombre', 'precio', 'stock']
        }
      ]
    });

    if (!proveedor || proveedor.is_active === false) {
      return res.status(404).json({
        mensaje: 'Proveedor no encontrado o inactivo.',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Proveedor encontrado correctamente.',
      resultado: proveedor
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al consultar proveedor.',
      resultado: error.message
    });
  }
};

// =========================
// Actualizar proveedor
// =========================
const actualizarProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const { nombre, nit, direccion, telefono, correo } = req.body;

    const proveedor = await Proveedor.findByPk(id_proveedor);

    if (!proveedor || proveedor.is_active === false) {
      return res.status(404).json({
        mensaje: 'Proveedor no encontrado o inactivo.',
        resultado: null
      });
    }

    // Validar formato de correo
    if (correo && !correo.includes('@')) {
      return res.status(400).json({
        mensaje: 'El correo electrónico no es válido.',
        resultado: null
      });
    }

    await proveedor.update({
      nombre,
      nit,
      direccion,
      telefono,
      correo
    });

    res.status(200).json({
      mensaje: 'Proveedor actualizado correctamente.',
      resultado: proveedor
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar proveedor.',
      resultado: error.message
    });
  }
};

// =========================
// Borrado lógico (soft delete)
// =========================
const eliminarProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;

    const proveedor = await Proveedor.findByPk(id_proveedor);

    if (!proveedor) {
      return res.status(404).json({
        mensaje: 'Proveedor no encontrado.',
        resultado: null
      });
    }

    await proveedor.update({
      is_active: false,
      deleted_at: new Date()
    });

    res.status(200).json({
      mensaje: 'Proveedor eliminado correctamente (borrado lógico).',
      resultado: proveedor
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar proveedor.',
      resultado: error.message
    });
  }
};

// =========================
// Exportar controladores
// =========================
module.exports = {
  registrarProveedor,
  listarProveedores,
  actualizarProveedor,
  eliminarProveedor,
  obtenerProveedorPorId
};
