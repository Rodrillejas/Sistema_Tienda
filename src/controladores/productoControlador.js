// =========================
// controllers/productoControlador.js
// =========================
const { Producto, Categoria, Proveedor } = require('../baseDatos/conexion');

// =========================
// Registrar nuevo producto
// =========================
const registrarProducto = async (req, res) => {
  try {
    const { nombre, sku, descripcion, precio, stock, id_categoria, id_proveedor } = req.body;

    // Verificar categoría
    const categoria = await Categoria.findByPk(id_categoria);
    if (!categoria || !categoria.is_active) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada o inactiva.', resultado: null });
    }

    // Verificar proveedor
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor || !proveedor.is_active) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado o inactivo.', resultado: null });
    }

    // Verificar duplicado
    const duplicado = await Producto.findOne({ where: { nombre } });
    if (duplicado) {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese nombre.', resultado: null });
    }

    // Crear producto
    const producto = await Producto.create({
      nombre,
      sku,
      descripcion,
      precio,
      stock,
      id_categoria,
      id_proveedor,
      is_active: true
    });

    res.status(201).json({ mensaje: 'Producto registrado correctamente.', resultado: producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar producto.', resultado: error.message });
  }
};

// =========================
// Listar productos activos
// =========================
const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { is_active: true },
      include: [
        { model: Categoria, attributes: ['nombre'], as: 'categoria', required: false },
        { model: Proveedor, attributes: ['nombre'], as: 'proveedor', required: false }
      ],
      order: [['id_productos', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de productos activos obtenida correctamente.',
      resultado: productos
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al listar productos.',
      resultado: error.message
    });
  }
};

// =========================
// Obtener producto por ID
// =========================
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id_productos } = req.params;

    const producto = await Producto.findByPk(id_productos, {
      include: [
        { model: Categoria, attributes: ['nombre'], as: 'categoria', required: false },
        { model: Proveedor, attributes: ['nombre'], as: 'proveedor', required: false }
      ]
    });

    if (!producto || !producto.is_active) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o inactivo.', resultado: null });
    }

    res.status(200).json({
      mensaje: 'Producto encontrado correctamente.',
      resultado: producto
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener producto.',
      resultado: error.message
    });
  }
};

// =========================
// Actualizar producto
// =========================
const actualizarProducto = async (req, res) => {
  try {
    const { id_productos } = req.params;
    const { nombre, sku, descripcion, precio, stock, id_categoria, id_proveedor } = req.body;

    const producto = await Producto.findByPk(id_productos);
    if (!producto || !producto.is_active) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o inactivo.', resultado: null });
    }

    // Validar categoría
    if (id_categoria) {
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria || !categoria.is_active) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada o inactiva.', resultado: null });
      }
    }

    // Validar proveedor
    if (id_proveedor) {
      const proveedor = await Proveedor.findByPk(id_proveedor);
      if (!proveedor || !proveedor.is_active) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado o inactivo.', resultado: null });
      }
    }

    await producto.update({
      nombre,
      sku,
      descripcion,
      precio,
      stock,
      id_categoria,
      id_proveedor
    });

    res.status(200).json({
      mensaje: 'Producto actualizado correctamente.',
      resultado: producto
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto.', resultado: error.message });
  }
};

// =========================
// Eliminar producto (soft delete)
// =========================
const eliminarProducto = async (req, res) => {
  try {
    const { id_productos } = req.params;
    const producto = await Producto.findByPk(id_productos);

    if (!producto || !producto.is_active) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o ya eliminado.', resultado: null });
    }

    await producto.update({ is_active: false });

    res.status(200).json({
      mensaje: 'Producto eliminado correctamente (borrado lógico).',
      resultado: producto
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto.', resultado: error.message });
  }
};

// =========================
// Listar productos por categoría
// =========================
const listarProductosPorCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const categoria = await Categoria.findByPk(id_categoria);
    if (!categoria || !categoria.is_active) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada o inactiva.', resultado: null });
    }

    const productos = await Producto.findAll({
      where: { id_categoria, is_active: true },
      include: [{ model: Proveedor, attributes: ['nombre'], as: 'proveedor', required: false }],
      order: [['id_productos', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de productos por categoría obtenida correctamente.',
      resultado: productos
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar productos por categoría.', resultado: error.message });
  }
};

// =========================
// Listar productos por proveedor
// =========================
const listarProductosPorProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor || !proveedor.is_active) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado o inactivo.', resultado: null });
    }

    const productos = await Producto.findAll({
      where: { id_proveedor, is_active: true },
      include: [{ model: Categoria, attributes: ['nombre'], as: 'categoria', required: false }],
      order: [['id_productos', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Lista de productos por proveedor obtenida correctamente.',
      resultado: productos
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar productos por proveedor.', resultado: error.message });
  }
};

// =========================
// Exportar controladores
// =========================
module.exports = {
  registrarProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  listarProductosPorCategoria,
  listarProductosPorProveedor
};
