// ===========================================
// 📘 Controlador: Clientes (versión funcional y coherente con el modelo)
// ===========================================
const { Cliente } = require('../baseDatos/conexion');

// ===========================================
// Registrar nuevo cliente
// ===========================================
const registrarCliente = async (req, res) => {
  try {
    const { nombre, tipo_documento, documento, direccion, telefono, correo } = req.body;

    // 🔎 Validar campos obligatorios
    if (!nombre || !documento) {
      return res.status(400).json({
        mensaje: 'El nombre y el documento son obligatorios.',
        resultado: null
      });
    }

    // 🔎 Verificar duplicado por documento o correo
    const existeDocumento = await Cliente.findOne({ where: { documento } });
    if (existeDocumento) {
      return res.status(400).json({
        mensaje: 'Ya existe un cliente con este documento.',
        resultado: null
      });
    }

    if (correo) {
      const existeCorreo = await Cliente.findOne({ where: { correo } });
      if (existeCorreo) {
        return res.status(400).json({
          mensaje: 'Ya existe un cliente con este correo electrónico.',
          resultado: null
        });
      }
    }

    // 🟢 Crear cliente
    const cliente = await Cliente.create({
      nombre,
      tipo_documento: tipo_documento || 'CC',
      documento,
      direccion: direccion || '',
      telefono: telefono || '',
      correo: correo || '',
      is_active: true
    });

    return res.status(201).json({
      mensaje: 'Cliente registrado correctamente.',
      resultado: cliente
    });
  } catch (error) {
    console.error('❌ Error al registrar cliente:', error);
    return res.status(500).json({
      mensaje: 'Error interno al registrar cliente.',
      resultado: error.message
    });
  }
};

// 🔍 Buscar cliente por cédula/documento (versión Sequelize)
const buscarPorCedula = async (req, res) => {
  try {
    const { cedula } = req.params;

    // Buscar cliente por documento y activo
    const cliente = await Cliente.findOne({
      where: { documento: cedula, is_active: true }
    });

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado o inactivo",
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: "Cliente encontrado correctamente",
      resultado: cliente
    });
  } catch (error) {
    console.error("❌ Error en buscarPorCedula:", error);
    res.status(500).json({
      mensaje: "Error al buscar el cliente",
      resultado: error.message
    });
  }
};


// ===========================================
// Listar clientes activos
// ===========================================
const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: { is_active: true },
      order: [['id_clientes', 'ASC']]
    });

    return res.status(200).json({
      mensaje: 'Lista de clientes activos obtenida correctamente.',
      resultado: clientes
    });
  } catch (error) {
    console.error('❌ Error al listar clientes:', error);
    return res.status(500).json({
      mensaje: 'Error interno al listar clientes.',
      resultado: error.message
    });
  }
};

// ===========================================
// Consultar cliente por ID
// ===========================================
const obtenerClientePorId = async (req, res) => {
  try {
    const { id_clientes } = req.params;

    const cliente = await Cliente.findByPk(id_clientes);

    if (!cliente || !cliente.is_active) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado o inactivo.',
        resultado: null
      });
    }

    return res.status(200).json({
      mensaje: 'Cliente encontrado correctamente.',
      resultado: cliente
    });
  } catch (error) {
    console.error('❌ Error al obtener cliente por ID:', error);
    return res.status(500).json({
      mensaje: 'Error interno al obtener cliente.',
      resultado: error.message
    });
  }
};

// ===========================================
// Actualizar cliente
// ===========================================
const actualizarCliente = async (req, res) => {
  try {
    const { id_clientes } = req.params;
    const { nombre, tipo_documento, documento, direccion, telefono, correo } = req.body;

    const cliente = await Cliente.findByPk(id_clientes);

    if (!cliente || !cliente.is_active) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado o inactivo.',
        resultado: null
      });
    }

    await cliente.update({
      nombre,
      tipo_documento,
      documento,
      direccion,
      telefono,
      correo
    });

    return res.status(200).json({
      mensaje: 'Cliente actualizado correctamente.',
      resultado: cliente
    });
  } catch (error) {
    console.error('❌ Error al actualizar cliente:', error);
    return res.status(500).json({
      mensaje: 'Error interno al actualizar cliente.',
      resultado: error.message
    });
  }
};

// ===========================================
// Borrado lógico (soft delete)
// ===========================================
const eliminarCliente = async (req, res) => {
  try {
    const { id_clientes } = req.params;

    const cliente = await Cliente.findByPk(id_clientes);

    if (!cliente) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado.',
        resultado: null
      });
    }

    await cliente.update({ is_active: false });
    await cliente.destroy(); // Sequelize usa deletedAt si paranoid: true

    return res.status(200).json({
      mensaje: 'Cliente eliminado correctamente (borrado lógico).',
      resultado: cliente
    });
  } catch (error) {
    console.error('❌ Error al eliminar cliente:', error);
    return res.status(500).json({
      mensaje: 'Error interno al eliminar cliente.',
      resultado: error.message
    });
  }
};

// ===========================================
// Exportar controladores
// ===========================================
module.exports = {
  registrarCliente,
  listarClientes,
  buscarPorCedula, // mantiene tu ruta /buscarPorCedula/:cedula
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente
};
