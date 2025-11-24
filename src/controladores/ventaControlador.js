// ================================
// src/controladores/ventaControlador.js
// ================================
const {
  Venta,
  DetalleVenta,
  Producto,
  Cliente,
  Usuario,
  Configuracion,
  sequelize
} = require('../baseDatos/conexion');

/* ============================================================
   REGISTRAR NUEVA VENTA (Automático: precio, impuestos y total)
   ============================================================ */
const registrarVenta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_clientes, id_usuarios, detalles } = req.body;

    // Validación inicial
    if (!id_clientes || !id_usuarios || !Array.isArray(detalles) || detalles.length === 0) {
      await t.rollback();
      return res.status(400).json({
        mensaje: 'Debe enviar id_clientes, id_usuarios y un arreglo de detalles.',
        resultado: null
      });
    }

    // Verificar cliente y usuario
    const cliente = await Cliente.findByPk(id_clientes);
    if (!cliente || !cliente.is_active) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Cliente no encontrado o inactivo.', resultado: null });
    }

    const usuario = await Usuario.findByPk(id_usuarios);
    if (!usuario || !usuario.is_active) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Usuario no encontrado o inactivo.', resultado: null });
    }

    // Obtener configuración (impuestos)
    const config = await Configuracion.findByPk(1);
    const impuestoPorcentaje = config ? parseFloat(config.impuestos_porcentaje) : 0;

    // Variables acumuladoras
    let subtotalGeneral = 0;
    const detallesProcesados = [];

    // Procesar detalles (automático)
    for (const item of detalles) {
      const producto = await Producto.findByPk(item.id_productos, { transaction: t });
      if (!producto || !producto.is_active) {
        await t.rollback();
        return res.status(404).json({
          mensaje: `Producto con ID ${item.id_productos} no encontrado o inactivo.`,
          resultado: null
        });
      }

      if (producto.stock < item.cantidad) {
        await t.rollback();
        return res.status(400).json({
          mensaje: `Stock insuficiente para el producto: ${producto.nombre}.`,
          resultado: null
        });
      }

      const precioUnitario = parseFloat(producto.precio);
      const cantidad = parseInt(item.cantidad);
      const subtotal = Number((precioUnitario * cantidad).toFixed(2));

      subtotalGeneral += subtotal;

      detallesProcesados.push({
        id_productos: producto.id_productos,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal
      });
    }

    // Calcular totales generales
    subtotalGeneral = Number(subtotalGeneral.toFixed(2));
    const impuestos = Number((subtotalGeneral * (impuestoPorcentaje / 100)).toFixed(2));
    const total = Number((subtotalGeneral + impuestos).toFixed(2));

    // Crear venta
    const venta = await Venta.create({
      id_clientes,
      id_usuarios,
      subtotal: subtotalGeneral,
      impuestos,
      total,
      estado: 'COMPLETADA',
      is_active: true
    }, { transaction: t });

    // Crear detalles y actualizar stock
    for (const det of detallesProcesados) {
      await DetalleVenta.create({
        id_ventas: venta.id_ventas,
        id_productos: det.id_productos,
        cantidad: det.cantidad,
        precio_unitario: det.precio_unitario,
        subtotal: det.subtotal
      }, { transaction: t });

      const producto = await Producto.findByPk(det.id_productos, { transaction: t });
      await producto.update({ stock: producto.stock - det.cantidad }, { transaction: t });
    }

    await t.commit();

    // Retornar venta con asociaciones
    const ventaConDetalles = await Venta.findByPk(venta.id_ventas, {
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id_clientes', 'nombre', 'documento'] },
        { model: Usuario, as: 'usuario', attributes: ['id_usuarios', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto', attributes: ['id_productos', 'nombre', 'precio'] }]
        }
      ]
    });

    return res.status(201).json({
      mensaje: `Venta registrada correctamente. Impuestos aplicados: ${impuestoPorcentaje}%`,
      resultado: ventaConDetalles
    });

  } catch (error) {
    await t.rollback();
    console.error('Error registrarVenta:', error);
    return res.status(500).json({ mensaje: 'Error al registrar venta.', resultado: error.message });
  }
};

/* =========================
   LISTAR TODAS LAS VENTAS
   ========================= */
const listarVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      where: { is_active: true },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id_clientes', 'nombre'] },
        { model: Usuario, as: 'usuario', attributes: ['id_usuarios', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto', attributes: ['id_productos', 'nombre', 'precio'] }]
        }
      ],
      order: [['id_ventas', 'ASC']]
    });

    return res.status(200).json({ mensaje: 'Lista de ventas activas.', resultado: ventas });
  } catch (error) {
    console.error('Error listarVentas:', error);
    return res.status(500).json({ mensaje: 'Error al listar ventas.', resultado: error.message });
  }
};

/* =========================
   OBTENER VENTA POR ID
   ========================= */
const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id_clientes', 'nombre', 'documento'] },
        { model: Usuario, as: 'usuario', attributes: ['id_usuarios', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto', attributes: ['id_productos', 'nombre', 'precio'] }]
        }
      ]
    });

    if (!venta || !venta.is_active) {
      return res.status(404).json({ mensaje: 'Venta no encontrada o inactiva.', resultado: null });
    }

    return res.status(200).json({ mensaje: 'Venta encontrada.', resultado: venta });
  } catch (error) {
    console.error('Error obtenerVentaPorId:', error);
    return res.status(500).json({ mensaje: 'Error al consultar venta.', resultado: error.message });
  }
};

/* =========================
   ACTUALIZAR VENTA
   ========================= */
const actualizarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_clientes, id_usuarios, subtotal, impuestos, total, estado } = req.body;

    const venta = await Venta.findByPk(id);
    if (!venta || !venta.is_active) {
      return res.status(404).json({ mensaje: 'Venta no encontrada o inactiva.', resultado: null });
    }

    await venta.update({ id_clientes, id_usuarios, subtotal, impuestos, total, estado });

    return res.status(200).json({ mensaje: 'Venta actualizada correctamente.', resultado: venta });
  } catch (error) {
    console.error('Error actualizarVenta:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar venta.', resultado: error.message });
  }
};

/* =========================
   ANULAR VENTA
   ========================= */
const anularVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);

    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada.', resultado: null });
    if (venta.estado === 'ANULADA') return res.status(400).json({ mensaje: 'Venta ya está anulada.', resultado: null });

    await venta.update({ estado: 'ANULADA' });

    return res.status(200).json({ mensaje: 'Venta anulada correctamente.', resultado: venta });
  } catch (error) {
    console.error('Error anularVenta:', error);
    return res.status(500).json({ mensaje: 'Error al anular venta.', resultado: error.message });
  }
};

/* =========================
   ELIMINAR VENTA (Borrado lógico)
   ========================= */
const eliminarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ mensaje: 'Venta no encontrada.', resultado: null });

    await venta.update({ is_active: false, deleted_at: new Date() });

    return res.status(200).json({ mensaje: 'Venta eliminada correctamente (borrado lógico).', resultado: venta });
  } catch (error) {
    console.error('Error eliminarVenta:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar venta.', resultado: error.message });
  }
};

/* =========================
   LISTAR VENTAS POR CLIENTE
   ========================= */
const listarVentasPorCliente = async (req, res) => {
  try {
    const { id_clientes } = req.params;
    const ventas = await Venta.findAll({
      where: { id_clientes, is_active: true },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id_usuarios', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto', attributes: ['id_productos', 'nombre', 'precio'] }]
        }
      ],
      order: [['id_ventas', 'ASC']]
    });

    if (!ventas.length)
      return res.status(404).json({ mensaje: 'No se encontraron ventas para este cliente.', resultado: [] });

    return res.status(200).json({ mensaje: 'Ventas encontradas para el cliente.', resultado: ventas });
  } catch (error) {
    console.error('Error listarVentasPorCliente:', error);
    return res.status(500).json({ mensaje: 'Error al listar ventas por cliente.', resultado: error.message });
  }
};

/* =========================
   LISTAR VENTAS POR USUARIO
   ========================= */
const listarVentasPorUsuario = async (req, res) => {
  try {
    const { id_usuarios } = req.params;
    const ventas = await Venta.findAll({
      where: { id_usuarios, is_active: true },
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id_clientes', 'nombre'] },
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [{ model: Producto, as: 'producto', attributes: ['id_productos', 'nombre', 'precio'] }]
        }
      ],
      order: [['id_ventas', 'ASC']]
    });

    if (!ventas.length)
      return res.status(404).json({ mensaje: 'No se encontraron ventas para este usuario.', resultado: [] });

    return res.status(200).json({ mensaje: 'Ventas encontradas para el usuario.', resultado: ventas });
  } catch (error) {
    console.error('Error listarVentasPorUsuario:', error);
    return res.status(500).json({ mensaje: 'Error al listar ventas por usuario.', resultado: error.message });
  }
};

module.exports = {
  registrarVenta,
  listarVentas,
  obtenerVentaPorId,
  actualizarVenta,
  anularVenta,
  eliminarVenta,
  listarVentasPorCliente,
  listarVentasPorUsuario
};
