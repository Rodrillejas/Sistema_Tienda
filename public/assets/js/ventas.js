// ================================
// assets/js/ventas.js (versión definitiva)
// ================================

const API_BASE = "http://localhost:3000/api";
const API_VENTAS = `${API_BASE}/ventas`;
const API_CLIENTES = `${API_BASE}/clientes`;
const API_USUARIOS = `${API_BASE}/usuarios`;
const API_PRODUCTOS = `${API_BASE}/productos`;

let detallesVenta = [];
let totalVenta = 0;

// utilidades
const formatMoney = n => Number(n).toLocaleString("es-CO", { style: "currency", currency: "COP" });

async function safeJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return {}; }
}

// Cargar usuarios (asesores)
async function cargarUsuarios() {
  try {
    const res = await fetch(`${API_USUARIOS}/listar`);
    const data = await safeJson(res);
    const usuarios = data.resultado || [];

    const select = document.getElementById("usuario_id");
    if (!select) return;
    select.innerHTML = `<option value="">Seleccione asesor...</option>`;
    usuarios.forEach(u => select.insertAdjacentHTML("beforeend", `<option value="${u.id_usuarios}">${u.nombre}</option>`));
  } catch (err) {
    console.error("Error al cargar usuarios:", err);
  }
}

// Cargar productos
async function cargarProductos() {
  try {
    const res = await fetch(`${API_PRODUCTOS}/listar`);
    const data = await safeJson(res);
    const productos = data.resultado || [];

    const select = document.getElementById("producto_id");
    if (!select) return;
    select.innerHTML = `<option value="">Seleccione producto...</option>`;

    productos.forEach(p => {
      const precio = (p.precio_venta ?? p.precio ?? 0);
      select.insertAdjacentHTML("beforeend", `<option value="${p.id_productos}" data-precio="${precio}">${p.nombre}</option>`);
    });
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}

// Buscar cliente por documento — intenta varias rutas posibles del backend
async function buscarClientePorDocumento(documento) {
  if (!documento) return null;
  const doc = String(documento).trim();

  const rutasPosibles = [
    `${API_CLIENTES}/buscarPorCedula/${encodeURIComponent(doc)}`, // tu ruta antigua
    `${API_CLIENTES}/buscar/${encodeURIComponent(doc)}`,           // a veces usan buscar/:documento
    `${API_CLIENTES}/documento/${encodeURIComponent(doc)}`         // fallback
  ];

  for (const url of rutasPosibles) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // si no es ok, intentar siguiente ruta
        continue;
      }
      const data = await safeJson(res);
      const cliente = data.resultado || null;
      if (cliente && (cliente.id_clientes || cliente.id)) return cliente;
    } catch (err) {
      console.warn("Intento fallido buscar cliente en:", url, err);
    }
  }
  return null;
}

// Manejo de input cédula/documento (keyup debounce + blur)
const cedulaInput = document.getElementById("cedulaCliente");
if (cedulaInput) {
  let debounce = null;
  cedulaInput.addEventListener("keyup", (e) => {
    const txt = e.target.value.trim();
    // limpiar si texto muy corto
    if (txt.length < 3) {
      const ni = document.getElementById("nombreCliente");
      const hid = document.getElementById("cliente_id");
      const vis = document.getElementById("clienteNombreVisible");
      if (ni) ni.value = "";
      if (hid) hid.value = "";
      if (vis) vis.classList.add("d-none");
      return;
    }
    clearTimeout(debounce);
    debounce = setTimeout(() => seaYMostrarCliente(txt), 300);
  });

  cedulaInput.addEventListener("blur", async (e) => {
    const txt = e.target.value.trim();
    if (!txt) return;
    await seaYMostrarCliente(txt);
  });
}

async function seaYMostrarCliente(documento) {
  try {
    const cliente = await buscarClientePorDocumento(documento);
    const nombreInput = document.getElementById("nombreCliente");
    const idInput = document.getElementById("cliente_id");
    const nombreVisible = document.getElementById("clienteNombreVisible");

    if (cliente && (cliente.id_clientes || cliente.id)) {
      // normalizar id y nombre
      const id = cliente.id_clientes ?? cliente.id;
      const nombre = cliente.nombre ?? cliente.nombre_cliente ?? cliente.nombreCompleto ?? "";
      if (nombreInput) nombreInput.value = nombre;
      if (idInput) idInput.value = id;
      if (nombreVisible) {
        nombreVisible.textContent = `👤 ${nombre}`;
        nombreVisible.classList.remove("d-none");
      }
    } else {
      if (nombreInput) nombreInput.value = "";
      if (idInput) idInput.value = "";
      if (nombreVisible) {
        nombreVisible.textContent = "";
        nombreVisible.classList.add("d-none");
      }
      // NO alertamos por cada keyup; si quieres notificación solo en blur:
      // alert("Cliente no encontrado. Regístrelo primero.");
    }
  } catch (err) {
    console.error("Error al buscar cliente:", err);
    alert("❌ Error al conectar con el servidor al buscar el cliente.");
  }
}

// Agregar detalle
document.getElementById("btnAgregarDetalle").addEventListener("click", () => {
  const productoSelect = document.getElementById("producto_id");
  const cantidadInput = document.getElementById("cantidad");
  const id_productos = parseInt(productoSelect.value);
  const cantidad = parseInt(cantidadInput.value);

  if (!id_productos) return alert("Seleccione un producto");
  if (!cantidad || cantidad <= 0) return alert("Ingrese una cantidad válida");

  const nombre = productoSelect.options[productoSelect.selectedIndex].text;
  const precio = parseFloat(productoSelect.options[productoSelect.selectedIndex].dataset.precio) || 0;
  const subtotal = Number((precio * cantidad).toFixed(2));

  detallesVenta.push({ id_productos, nombre, cantidad, precio, subtotal });
  totalVenta = Number((totalVenta + subtotal).toFixed(2));
  renderizarDetalles();

  // limpiar selección para siguiente
  productoSelect.value = "";
  cantidadInput.value = "1";
});

function renderizarDetalles() {
  const tbody = document.querySelector("#tablaDetalles tbody");
  tbody.innerHTML = "";
  detallesVenta.forEach((d, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${d.nombre}</td>
        <td>${d.cantidad}</td>
        <td>${formatMoney(d.precio)}</td>
        <td>${formatMoney(d.subtotal)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarDetalle(${i})">❌</button></td>
      </tr>
    `);
  });
  const totalEl = document.getElementById("totalVenta");
  if (totalEl) totalEl.textContent = `Total: ${formatMoney(totalVenta)}`;
}

window.eliminarDetalle = function (i) {
  if (!detallesVenta[i]) return;
  totalVenta = Number((totalVenta - detallesVenta[i].subtotal).toFixed(2));
  detallesVenta.splice(i, 1);
  renderizarDetalles();
};

// Guardar venta: **NOTA IMPORTANTE** hacemos POST a /ventas/registrar (la mayoría de backends usan esa ruta)
document.getElementById("formVenta").addEventListener("submit", async e => {
  e.preventDefault();

  const id_clientes = document.getElementById("cliente_id").value;
  const id_usuarios = document.getElementById("usuario_id").value;

  if (!id_clientes) return alert("Seleccione o busque un cliente");
  if (!id_usuarios) return alert("Seleccione un asesor de venta");
  if (detallesVenta.length === 0) return alert("Agregue al menos un producto");

  // Enviar solo los campos que el backend necesita:
  const detalles = detallesVenta.map(d => ({
    id_productos: d.id_productos,
    cantidad: d.cantidad
  }));

  const payload = {
    id_clientes: Number(id_clientes),
    id_usuarios: Number(id_usuarios),
    detalles
    // no envíes total/subtotal si el backend los calcula (pero si tu backend requiere total, puedes agregar total: totalVenta)
  };

  try {
    // observar: la ruta suele ser /api/ventas/registrar en muchas APIs
    const res = await fetch(`${API_VENTAS}/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await safeJson(res);

    if (res.ok) {
      alert("✅ Venta registrada correctamente");
      detallesVenta = [];
      totalVenta = 0;
      renderizarDetalles();
      listarVentas();
      // cerrar modal si existe
      const modalEl = document.getElementById("ventaModal");
      if (modalEl) {
        const instance = bootstrap.Modal.getInstance(modalEl);
        if (instance) instance.hide();
      }
      // limpiar inputs
      document.getElementById("cedulaCliente").value = "";
      document.getElementById("cliente_id").value = "";
      document.getElementById("nombreCliente").value = "";
      document.getElementById("clienteNombreVisible").classList.add("d-none");
    } else {
      // mostrar mensaje detallado del servidor (muy útil)
      console.error("Error registrar venta:", data);
      const msg = data?.mensaje || data?.error || JSON.stringify(data) || "Error al registrar la venta";
      alert(`❌ Error al registrar la venta: ${msg}`);
    }
  } catch (err) {
    console.error("Fallo conexion registrar venta:", err);
    alert("❌ Error al conectar con el servidor");
  }
});

// Listar ventas
async function listarVentas() {
  try {
    const res = await fetch(`${API_VENTAS}/listar`);
    const data = await safeJson(res);
    const ventas = data.resultado || [];
    const tbody = document.querySelector("#tablaVentas tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    ventas.forEach(v => {
      const fecha = new Date(v.fecha_venta || v.fecha || Date.now()).toLocaleDateString();
      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${v.id_ventas}</td>
          <td>${fecha}</td>
          <td>${v.cliente?.nombre ?? "—"}</td>
          <td>${v.usuario?.nombre ?? "—"}</td>
          <td>${formatMoney(v.total ?? v.total_venta ?? 0)}</td>
          <td><button class="btn btn-danger btn-sm" onclick="eliminarVenta(${v.id_ventas})">🗑</button></td>
        </tr>
      `);
    });
  } catch (err) {
    console.error("Error al listar ventas:", err);
  }
}

window.eliminarVenta = async function (id) {
  if (!confirm("¿Seguro que desea eliminar esta venta?")) return;
  await fetch(`${API_VENTAS}/${id}`, { method: "DELETE" });
  listarVentas();
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
  cargarProductos();
  listarVentas();

  const ventaModal = document.getElementById("ventaModal");
  if (ventaModal) ventaModal.addEventListener('shown.bs.modal', () => {
    const ced = document.getElementById("cedulaCliente");
    if (ced) ced.focus();
  });
});
