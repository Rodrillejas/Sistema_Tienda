// ==============================
// controllers/usuarioControlador.js
// ==============================
const { Usuario, Rol } = require('../baseDatos/conexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// ===========================
// Crear un nuevo usuario
// ===========================
const crearUsuario = async (req, res) => {
  try {
    const { username, password, nombre, correo, id_roles } = req.body;

    // Validar campos obligatorios
    if (!username || !password || !id_roles) {
      return res.status(400).json({
        mensaje: 'El username, la contraseña y el rol son obligatorios.',
        resultado: null
      });
    }

    // Verificar duplicado por username o correo
    const existente = await Usuario.findOne({
      where: { username }
    }) || (correo && await Usuario.findOne({ where: { correo } }));

    if (existente) {
      return res.status(400).json({
        mensaje: 'El usuario o correo ya está registrado.',
        resultado: null
      });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      username,
      password_hash: hash,
      nombre,
      correo,
      id_roles,
      is_active: true
    });

    res.status(201).json({
      mensaje: 'Usuario creado correctamente.',
      resultado: nuevoUsuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear usuario.',
      resultado: error.message
    });
  }
};

// ===========================
// Iniciar sesión
// ===========================
const iniciarSesion = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario activo
    const usuarioEncontrado = await Usuario.findOne({
      where: { username, is_active: true },
      include: [{ model: Rol, as: 'rol', attributes: ['id_roles', 'nombre'] }]
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado o inactivo.',
        resultado: null
      });
    }

    // Validar contraseña
    const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password_hash);
    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Contraseña incorrecta.',
        resultado: null
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuarios: usuarioEncontrado.id_usuarios,
        username: usuarioEncontrado.username,
        rol: usuarioEncontrado.rol?.nombre
      },
      process.env.JWT_SECRET || 'claveSuperSecreta123',
      { expiresIn: '8h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      resultado: {
        usuario: {
          id_usuarios: usuarioEncontrado.id_usuarios,
          username: usuarioEncontrado.username,
          nombre: usuarioEncontrado.nombre,
          rol: usuarioEncontrado.rol?.nombre
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al iniciar sesión.',
      resultado: error.message
    });
  }
};

// ===========================
// Listar usuarios activos
// ===========================
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { is_active: true },
      include: [{ model: Rol, as: 'rol', attributes: ['id_roles', 'nombre'] }],
      order: [['id_usuarios', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de usuarios activos obtenida correctamente.',
      resultado: usuarios
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar usuarios.',
      resultado: error.message
    });
  }
};

// ===========================
// Obtener usuario por ID
// ===========================
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id_usuarios } = req.params;

    const usuario = await Usuario.findByPk(id_usuarios, {
      include: [{ model: Rol, as: 'rol', attributes: ['id_roles', 'nombre'] }]
    });

    if (!usuario || !usuario.is_active) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado o inactivo.',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Usuario encontrado correctamente.',
      resultado: usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener usuario.',
      resultado: error.message
    });
  }
};

// ===========================
// Actualizar usuario
// ===========================
const actualizarUsuario = async (req, res) => {
  try {
    const { id_usuarios } = req.params;
    const { password, ...otrosDatos } = req.body;

    const usuario = await Usuario.findByPk(id_usuarios);

    if (!usuario || !usuario.is_active) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado o inactivo.',
        resultado: null
      });
    }

    // Encriptar nueva contraseña si fue enviada
    if (password) {
      otrosDatos.password_hash = await bcrypt.hash(password, 10);
    }

    await usuario.update(otrosDatos);

    res.status(200).json({
      mensaje: 'Usuario actualizado correctamente.',
      resultado: usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar usuario.',
      resultado: error.message
    });
  }
};

// ===========================
// Eliminar usuario (soft delete)
// ===========================
const eliminarUsuario = async (req, res) => {
  try {
    const { id_usuarios } = req.params;

    const usuario = await Usuario.findByPk(id_usuarios);

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado.',
        resultado: null
      });
    }

    // Soft delete: is_active = false + paranoid delete
    await usuario.update({ is_active: false });
    await usuario.destroy();

    res.status(200).json({
      mensaje: 'Usuario eliminado correctamente (borrado lógico).',
      resultado: usuario
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar usuario.',
      resultado: error.message
    });
  }
};

// ===========================
// Exportar controladores
// ===========================
module.exports = {
  crearUsuario,
  iniciarSesion,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};
