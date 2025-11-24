// =========================
// controllers/detalleVentaControlador.js
// =========================
const { DetalleVenta, Venta, Producto } = require('../baseDatos/conexion');




// =========================
// Registrar detalle de venta
// =========================
const registrarDetalleVenta = async (req, res) => {
  try {
    const { id_ventas, id_productos, cantidad, precio_unitario } = req.body;

    // Validar existencia de la venta y producto
    const venta = await Venta.findByPk(id_ventas);
    const producto = await Producto.findByPk(id_productos);

    if (!venta) {
      return res.status(404).json({
        mensaje: 'Venta no encontrada.',
        resultado: null
      });
    }

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado.',
        resultado: null
      });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({
        mensaje: `Stock insuficiente para el producto: ${producto.nombre}.`,
        resultado: null
      });
    }

    const subtotal = cantidad * precio_unitario;

    const detalle = await DetalleVenta.create({
      id_ventas,
      id_productos,
      cantidad,
      precio_unitario,
      subtotal
    });

    res.status(201).json({
      mensaje: 'Detalle de venta registrado correctamente.',
      resultado: detalle
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar el detalle de venta.',
      resultado: error.message
    });
  }
};

// =========================
// Listar todos los detalles de venta
// =========================
const listarDetallesVenta = async (req, res) => {
  try {
    const detalles = await DetalleVenta.findAll({
      include: [
        { model: Producto, as: 'producto', attributes: ['nombre', 'precio'] },
        { model: Venta, as: 'venta', attributes: ['id_ventas', 'fecha', 'total'] }
      ],
      order: [['id_ventaDetalle', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de detalles de venta obtenida correctamente.',
      resultado: detalles
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar los detalles de venta.',
      resultado: error.message
    });
  }
};

// =========================
// Obtener detalle de venta por ID
// =========================
const obtenerDetalleVentaPorId = async (req, res) => {
  try {
    const { id_ventaDetalle } = req.params;
    const detalle = await DetalleVenta.findByPk(id_ventaDetalle, {
      include: [
        { model: Producto, as: 'producto', attributes: ['nombre', 'precio'] },
        { model: Venta, as: 'venta', attributes: ['id_ventas', 'fecha', 'total'] }
      ]
    });

    if (!detalle) {
      return res.status(404).json({
        mensaje: 'Detalle de venta no encontrado.',
        resultado: null
      });
    }

    res.status(200).json({
      mensaje: 'Detalle de venta encontrado correctamente.',
      resultado: detalle
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al consultar detalle de venta.',
      resultado: error.message
    });
  }
};

// =========================
// Actualizar detalle de venta
// =========================
const actualizarDetalleVenta = async (req, res) => {
  try {
    const { id_ventaDetalle } = req.params;
    const { cantidad, precio_unitario } = req.body;

    const detalle = await DetalleVenta.findByPk(id_ventaDetalle);
    if (!detalle) {
      return res.status(404).json({
        mensaje: 'Detalle de venta no encontrado.',
        resultado: null
      });
    }

    const producto = await Producto.findByPk(detalle.id_productos);
    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto asociado no encontrado.',
        resultado: null
      });
    }

    const subtotal = cantidad * precio_unitario;

    await detalle.update({ cantidad, precio_unitario, subtotal });

    res.status(200).json({
      mensaje: 'Detalle de venta actualizado correctamente.',
      resultado: detalle
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar detalle de venta.',
      resultado: error.message
    });
  }
};

// =========================
// Eliminar detalle de venta (físico)
// =========================
const eliminarDetalleVenta = async (req, res) => {
  try {
    const { id_ventaDetalle } = req.params;
    const detalle = await id_ventaDetalle.findByPk(id);

    if (!detalle) {
      return res.status(404).json({
        mensaje: 'Detalle de venta no encontrado.',
        resultado: null
      });
    }

    await detalle.destroy();

    res.status(200).json({
      mensaje: 'Detalle de venta eliminado correctamente.',
      resultado: detalle
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar detalle de venta.',
      resultado: error.message
    });
  }
};

module.exports = {
  registrarDetalleVenta,
  listarDetallesVenta,
  obtenerDetalleVentaPorId,
  actualizarDetalleVenta,
  eliminarDetalleVenta
};
