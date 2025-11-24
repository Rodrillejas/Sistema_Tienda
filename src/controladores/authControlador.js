// ==============================
// src/controladores/authControlador.js
// ==============================
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Usuario, Rol } = require("../baseDatos/conexion");

const SECRET_KEY = process.env.JWT_SECRET || "clave_super_segura_tienda";

const login = async (req, res) => {
  try {
    // 👇 Acepta tanto password como contrasena
    const { correo, username, password, contrasena } = req.body;
    const clave = password || contrasena; // ✅ unifica el campo de contraseña

    if ((!correo && !username) || !clave) {
      return res.status(400).json({ mensaje: "Correo/usuario y contraseña son obligatorios." });
    }

    // Buscar usuario por correo o username
    const usuario = await Usuario.findOne({
      where: correo ? { correo } : { username },
      include: [{ model: Rol, as: "rol" }]
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // 👇 Verifica con el campo real de tu base de datos: password_hash
    const contrasenaValida = await bcrypt.compare(clave, usuario.password_hash);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      {
        id_usuarios: usuario.id_usuarios,
        nombre: usuario.nombre,
        rol: usuario.rol?.nombre || "Registrador"
      },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id_usuarios: usuario.id_usuarios,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol?.nombre
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión.",
      resultado: error.message
    });
  }
};

module.exports = { login };
