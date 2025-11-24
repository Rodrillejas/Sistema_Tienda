// ==============================
// 🌐 CONFIG API
// ==============================
const API_CLIENTES = 'http://localhost:3000/api/clientes';

// ==============================
// util: parseo seguro de JSON desde text
// ==============================
function safeParseJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.warn('safeParseJson: respuesta no JSON', text);
    return null;
  }
}

// ==============================
// 📋 LISTAR CLIENTES
// ==============================
async function listarClientes() {
  try {
    const res = await fetch(`${API_CLIENTES}/listar`);
    if (!res.ok) {
      console.error('listarClientes: HTTP', res.status);
      return;
    }
    const data = await res.json();
    const clientes = Array.isArray(data.resultado) ? data.resultado : [];
    const tbody = document.querySelector('#tablaClientes tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (clientes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">No hay clientes registrados.</td></tr>`;
      return;
    }

    clientes.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.id_clientes}</td>
        <td>${c.nombre}</td>
        <td>${c.tipo_documento || '-'}</td>
        <td>${c.documento}</td>
        <td>${c.telefono || '-'}</td>
        <td>${c.correo || '-'}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-info me-1" onclick="verCliente(${c.id_clientes})">👁</button>
          <button class="btn btn-sm btn-warning me-1" onclick="editarCliente(${c.id_clientes})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarCliente(${c.id_clientes})">🗑</button>
        </td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('❌ Error al listar clientes:', err);
  }
}

// ==============================
// 🔍 BUSCAR CLIENTES (frontend)
// ==============================
function buscarClientes() {
  const texto = document.getElementById('buscar')?.value.toLowerCase() || '';
  document.querySelectorAll('#tablaClientes tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(texto) ? '' : 'none';
  });
}

// ==============================
// ➕ CREAR CLIENTE (separado de submit)
// ==============================
async function crearCliente(payload) {
  try {
    const res = await fetch(`${API_CLIENTES}/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    const data = safeParseJson(text) || { mensaje: text || 'Sin respuesta del servidor.' };

    alert(data.mensaje || 'Operación completada');
    return res.ok;
  } catch (error) {
    console.error('❌ Error al guardar cliente:', error);
    alert('⚠️ Error al guardar el cliente. Revisa la consola.');
    return false;
  }
}

// ==============================
// ✏️ CARGAR CLIENTE EN EDICIÓN (abre modal y llena campos)
// ==============================
async function editarCliente(id) {
  try {
    const res = await fetch(`${API_CLIENTES}/buscar/${id}`);
    if (!res.ok) {
      alert('Cliente no encontrado');
      return;
    }
    const data = await res.json();
    const c = data.resultado;
    if (!c) return alert('Cliente no encontrado');

    document.getElementById('id_clientes').value = c.id_clientes;
    document.getElementById('nombre').value = c.nombre;
    document.getElementById('tipo_documento').value = c.tipo_documento || '';
    document.getElementById('documento').value = c.documento;
    document.getElementById('direccion').value = c.direccion || '';
    document.getElementById('telefono').value = c.telefono || '';
    document.getElementById('correo').value = c.correo || '';
    document.getElementById('modalClienteLabel').textContent = 'Editar Cliente';

    const modal = new bootstrap.Modal(document.getElementById('modalCliente'));
    modal.show();
  } catch (err) {
    console.error('❌ Error al cargar cliente:', err);
    alert('Error al cargar cliente. Revisa la consola.');
  }
}

// ==============================
// 🔄 ACTUALIZAR CLIENTE
// ==============================
async function actualizarCliente() {
  const id = document.getElementById('id_clientes').value;
  if (!id) return alert('ID de cliente inválido.');

  const cliente = {
    nombre: document.getElementById('nombre').value,
    tipo_documento: document.getElementById('tipo_documento').value,
    documento: document.getElementById('documento').value,
    direccion: document.getElementById('direccion').value,
    telefono: document.getElementById('telefono').value,
    correo: document.getElementById('correo').value
  };

  try {
    const res = await fetch(`${API_CLIENTES}/actualizar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });

    const text = await res.text();
    const data = safeParseJson(text) || { mensaje: text || 'Sin respuesta del servidor.' };

    alert(data.mensaje || 'Cliente actualizado');
    if (res.ok) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalCliente'));
      if (modal) modal.hide();
      listarClientes();
    }
  } catch (error) {
    console.error('❌ Error al actualizar cliente:', error);
    alert('⚠️ Error al actualizar el cliente. Revisa la consola.');
  }
}

// ==============================
// 👁 VER DETALLE CLIENTE
// ==============================
async function verCliente(id) {
  try {
    const res = await fetch(`${API_CLIENTES}/buscar/${id}`);
    if (!res.ok) return alert('Cliente no encontrado');
    const data = await res.json();
    const c = data.resultado;
    alert(`
📋 CLIENTE
Nombre: ${c.nombre}
Documento: ${c.tipo_documento} ${c.documento}
Teléfono: ${c.telefono || '-'}
Correo: ${c.correo || '-'}
Dirección: ${c.direccion || '-'}
    `);
  } catch (err) {
    console.error('❌ Error al ver cliente:', err);
    alert('Error al obtener datos del cliente.');
  }
}

// ==============================
// 🗑 ELIMINAR CLIENTE
// ==============================
async function eliminarCliente(id) {
  if (!confirm('¿Eliminar cliente?')) return;
  try {
    const res = await fetch(`${API_CLIENTES}/eliminar/${id}`, { method: 'DELETE' });
    const text = await res.text();
    const data = safeParseJson(text) || { mensaje: text || 'Sin respuesta del servidor.' };
    alert(data.mensaje || 'Operación completada');
    if (res.ok) listarClientes();
  } catch (err) {
    console.error('❌ Error al eliminar cliente:', err);
    alert('Error al eliminar cliente. Revisa la consola.');
  }
}

// ==============================
// 🚀 INICIALIZACIÓN
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar navbar dinámico si existe (tu navbar.js lo maneja)
  if (typeof cargarNavbar === 'function') {
    try { cargarNavbar(); } catch (e) { /* no obligatorio */ }
  }

  const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'));

  // Mostrar modal para nuevo cliente
  const btnNuevo = document.getElementById('btnNuevo');
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      document.getElementById('formCliente').reset();
      document.getElementById('id_clientes').value = '';
      document.getElementById('modalClienteLabel').textContent = 'Registrar Cliente';
      modalCliente.show();
    });
  }

  // Manejo del formulario (crear o actualizar)
  const form = document.getElementById('formCliente');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('id_clientes').value;
      const payload = {
        nombre: document.getElementById('nombre').value,
        tipo_documento: document.getElementById('tipo_documento').value,
        documento: document.getElementById('documento').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
      };

      if (id) {
        // actualizar
        await actualizarCliente();
      } else {
        // crear
        const ok = await crearCliente(payload);
        if (ok) {
          modalCliente.hide();
          listarClientes();
        }
      }
    });
  }

  // Buscar local (input)
  const buscarInput = document.getElementById('buscar');
  if (buscarInput) buscarInput.addEventListener('input', buscarClientes);

  // inicializar listado si existe tabla
  if (document.querySelector('#tablaClientes')) listarClientes();
});
