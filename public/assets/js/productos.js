// =========================
// assets/js/productos.js
// Versión robusta: soporta varias formas de campos devueltos por el backend
// =========================

const API_BASE = "http://localhost:3000/api/productos";
const API_CATEGORIAS = "http://localhost:3000/api/categorias/listar";
const API_PROVEEDORES = "http://localhost:3000/api/proveedores/listar";

// DOM
const cuerpoTabla = document.querySelector("#tablaProductos tbody");
const formProducto = document.getElementById("formProducto");
const modalProducto = new bootstrap.Modal(document.getElementById("modalProducto"));
const selectCategoria = document.getElementById("categoria");
const selectProveedor = document.getElementById("proveedor");
const btnNuevo = document.getElementById("btnNuevo");
const inputBuscar = document.getElementById("buscar");
const inputHiddenId = document.getElementById("id_producto"); // hidden id

let modoEdicion = false;
let idProductoActual = null;

// ---------- util: parse JSON seguro
async function safeJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); }
  catch { throw new Error("Respuesta no válida del servidor"); }
}

// ---------- util: extrae id del objeto producto (variantes)
function getProductId(p) {
  return p.id_productos ?? p.id_producto ?? p.id ?? null;
}

// ---------- util: extrae campo descripcion (variantes)
function getDescripcion(p) {
  return p.descripcion ?? p.decripcion ?? p.desc ?? "";
}

// ---------- util: extrae categoria id (variantes)
function getCategoriaId(p) {
  return p.id_categoria ?? p.id_categorias ?? p.categoria_id ?? (p.Categoria && (p.Categoria.id_categoria ?? p.Categoria.id)) ?? null;
}

// ---------- util: extrae proveedor id (variantes)
function getProveedorId(p) {
  return p.id_proveedor ?? p.id_proveedores ?? p.proveedor_id ?? (p.Proveedor && (p.Proveedor.id_proveedor ?? p.Proveedor.id)) ?? null;
}

// =========================
// Listar productos - muestra tabla
// =========================
async function listarProductos() {
  try {
    const res = await fetch(`${API_BASE}/listar`);
    if (!res.ok) {
      console.error("listarProductos: HTTP", res.status);
      return;
    }
    const data = await safeJson(res);
    const productos = data.resultado || [];

    cuerpoTabla.innerHTML = "";

    productos.forEach(p => {
      const id = getProductId(p) ?? "-";
      const nombre = p.nombre ?? "-";
      const sku = p.sku ?? "-";
      const descripcion = getDescripcion(p) || "-";

      // categoria/proveedor: puede venir como p.categoria / p.Categoria o p.Categoria.nombre
      const catNombre = (p.categoria && (p.categoria.nombre || p.categoria.nombre)) 
                        || (p.Categoria && p.Categoria.nombre) || "Sin categoría";
      const provNombre = (p.proveedor && p.proveedor.nombre)
                         || (p.Proveedor && p.Proveedor.nombre) || "Sin proveedor";

      const stock = p.stock ?? 0;
      const precio = p.precio ?? 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${sku}</td>
        <td>${descripcion}</td>
        <td>${catNombre}</td>
        <td>${provNombre}</td>
        <td>${stock}</td>
        <td>$${precio}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${id})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${id})">🗑️</button>
        </td>
      `;
      cuerpoTabla.appendChild(tr);
    });
  } catch (err) {
    console.error("Error listarProductos:", err);
  }
}

// =========================
// Cargar selects (categorias y proveedores)
// =========================
async function cargarSelects() {
  try {
    const [rCat, rProv] = await Promise.all([
      fetch(API_CATEGORIAS),
      fetch(API_PROVEEDORES)
    ]);

    const catData = rCat.ok ? await safeJson(rCat) : { resultado: [] };
    const provData = rProv.ok ? await safeJson(rProv) : { resultado: [] };

    const cats = catData.resultado || [];
    const provs = provData.resultado || [];

    // limpiar y rellenar
    selectCategoria.innerHTML = '<option value="">Seleccione categoría</option>';
    cats.forEach(c => {
      const id = c.id_categoria ?? c.id_categorias ?? c.id ?? "";
      const nombre = c.nombre ?? c.nombre_categoria ?? "(sin nombre)";
      selectCategoria.insertAdjacentHTML("beforeend", `<option value="${id}">${nombre}</option>`);
    });

    selectProveedor.innerHTML = '<option value="">Seleccione proveedor</option>';
    provs.forEach(p => {
      const id = p.id_proveedor ?? p.id_proveedores ?? p.id ?? "";
      const nombre = p.nombre ?? "(sin nombre)";
      selectProveedor.insertAdjacentHTML("beforeend", `<option value="${id}">${nombre}</option>`);
    });

  } catch (err) {
    console.error("Error cargarSelects:", err);
    selectCategoria.innerHTML = '<option value="">Error cargando categorías</option>';
    selectProveedor.innerHTML = '<option value="">Error cargando proveedores</option>';
  }
}

// =========================
// Crear / Actualizar producto
// =========================
formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  // asegurar que tomamos el id del hidden si existe
  const hiddenId = inputHiddenId ? (inputHiddenId.value || null) : null;

  const payload = {
    nombre: formProducto.nombre.value.trim(),
    sku: formProducto.sku.value.trim(),
    // enviamos ambos nombres de campo por compatibilidad:
    descripcion: formProducto.descripcion.value.trim(), // preferido
    decripcion: formProducto.descripcion.value.trim(),  // por si backend usa ese typo
    precio: parseFloat(formProducto.precio.value) || 0,
    stock: parseInt(formProducto.stock.value) || 0,
    id_categoria: formProducto.categoria.value ? parseInt(formProducto.categoria.value) : null,
    id_proveedor: formProducto.proveedor.value ? parseInt(formProducto.proveedor.value) : null
  };

  try {
    let res;
    if (modoEdicion && (idProductoActual || hiddenId)) {
      const idParaUsar = idProductoActual ?? hiddenId;
      res = await fetch(`${API_BASE}/actualizar/${idParaUsar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API_BASE}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const data = await safeJson(res);
    if (!res.ok) {
      // mostrar mensaje devuelto por backend
      console.error("Error response registrar/actualizar:", res.status, data);
      alert(data.mensaje || `Error ${res.status}`);
    } else {
      alert(data.mensaje || "Operación completada");
    }

    // limpiar y actualizar UI
    modoEdicion = false;
    idProductoActual = null;
    if (inputHiddenId) inputHiddenId.value = "";
    formProducto.reset();
    modalProducto.hide();
    listarProductos();
  } catch (err) {
    console.error("Error submit producto:", err);
    alert("Error al guardar producto. Revisa la consola.");
  }
});

// =========================
// Editar producto - carga datos al modal
// =========================
async function editarProducto(id) {
  try {
    const res = await fetch(`${API_BASE}/buscar/${id}`);
    if (!res.ok) {
      console.error("editarProducto: HTTP", res.status);
      alert("No se pudo obtener el producto del servidor.");
      return;
    }

    const data = await safeJson(res);
    const p = data.resultado;

    if (!p) {
      alert("Producto no encontrado.");
      return;
    }

    // cargar selects antes (para que las options existan)
    await cargarSelects();

    // asignar campos con tolerancia a nombres distintos
    const pid = getProductId(p);
    idProductoActual = pid;
    if (inputHiddenId) inputHiddenId.value = pid;

    formProducto.nombre.value = p.nombre ?? "";
    formProducto.sku.value = p.sku ?? "";
    // descripcion: tomar la variante correcta
    formProducto.descripcion.value = getDescripcion(p) ?? "";

    // categoria/proveedor: preferir id directo, si no buscar en objeto Categoria/Proveedor
    const idCat = getCategoriaId(p);
    const idProv = getProveedorId(p);

    if (idCat) {
      // si la option existe, la seleccionamos, si no la añadimos temporalmente
      const optCat = selectCategoria.querySelector(`option[value="${idCat}"]`);
      if (!optCat) selectCategoria.insertAdjacentHTML('beforeend', `<option value="${idCat}">Categoria #${idCat}</option>`);
      selectCategoria.value = idCat;
    } else {
      selectCategoria.value = "";
    }

    if (idProv) {
      const optProv = selectProveedor.querySelector(`option[value="${idProv}"]`);
      if (!optProv) selectProveedor.insertAdjacentHTML('beforeend', `<option value="${idProv}">Proveedor #${idProv}</option>`);
      selectProveedor.value = idProv;
    } else {
      selectProveedor.value = "";
    }

    formProducto.precio.value = p.precio ?? "";
    formProducto.stock.value = p.stock ?? "";

    modoEdicion = true;
    modalProducto.show();
  } catch (err) {
    console.error("Error editarProducto:", err);
    alert("Error al cargar producto para editar. Revisa la consola.");
  }
}
window.editarProducto = editarProducto;

// =========================
// Eliminar producto
// =========================
async function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  try {
    const res = await fetch(`${API_BASE}/eliminar/${id}`, { method: "DELETE" });
    const data = await safeJson(res);
    alert(data.mensaje || "Producto eliminado");
    listarProductos();
  } catch (err) {
    console.error("Error eliminarProducto:", err);
    alert("Error al eliminar. Revisa la consola.");
  }
}
window.eliminarProducto = eliminarProducto;

// =========================
// Nuevo producto
// =========================
async function nuevoProducto() {
  modoEdicion = false;
  idProductoActual = null;
  if (inputHiddenId) inputHiddenId.value = "";
  formProducto.reset();
  await cargarSelects();
  modalProducto.show();
}

// =========================
// Buscar (filtro local en tabla)
function buscarProductos() {
  const texto = (inputBuscar?.value || "").toLowerCase();
  document.querySelectorAll("#tablaProductos tbody tr").forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(texto) ? "" : "none";
  });
}

// init
document.addEventListener("DOMContentLoaded", () => {
  listarProductos();
  cargarSelects();
  if (btnNuevo) btnNuevo.addEventListener("click", nuevoProducto);
  if (inputBuscar) inputBuscar.addEventListener("input", buscarProductos);
});
