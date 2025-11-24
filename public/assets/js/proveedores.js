// ==============================
// assets/js/proveedores.js
// Gestión de Proveedores (versión robusta)
// ==============================

(() => {
  const API_PROVEEDORES = 'http://localhost:3000/api/proveedores';

  // elementos (se asignan en DOMContentLoaded)
  let modalProveedorInstance = null;

  // util: parse JSON seguro (maneja respuestas vacías)
  async function safeJson(res) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return {}; }
  }

  // ==============================
  // Listar proveedores
  // ==============================
  async function listarProveedores() {
    try {
      const res = await fetch(`${API_PROVEEDORES}/listar`);
      const data = await safeJson(res);
      const proveedores = data.resultado || [];
      const tbody = document.querySelector('#tablaProveedores tbody');
      if (!tbody) return;
      tbody.innerHTML = '';

      proveedores.forEach(p => {
        // normalizar id (dependiendo de cómo lo regreses desde el backend)
        const id = p.id_proveedor ?? p.id_proveedores ?? p.id ?? '—';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${id}</td>
          <td>${p.nombre ?? '-'}</td>
          <td>${p.nit ?? '-'}</td>
          <td>${p.telefono ?? '-'}</td>
          <td>${p.correo ?? '-'}</td>
          <td>${p.direccion ?? '-'}</td>
          <td>
            <button class="btn btn-warning btn-sm me-1" data-action="editar" data-id="${id}">✏️</button>
            <button class="btn btn-danger btn-sm" data-action="eliminar" data-id="${id}">🗑</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Delegación de eventos para botones (más robusto que inline onclick)
      tbody.querySelectorAll('button').forEach(btn => {
        btn.removeEventListener('click', tbodyButtonHandler);
        btn.addEventListener('click', tbodyButtonHandler);
      });
    } catch (err) {
      console.error('❌ Error al listar proveedores:', err);
      // no alertar demasiado, pero puedes descomentar si deseas notificar
      // alert('⚠️ Error al cargar proveedores.');
    }
  }

  // Delegated click handler for buttons inside tabla
  async function tbodyButtonHandler(e) {
    const btn = e.currentTarget;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'editar') {
      await editarProveedor(id);
    } else if (action === 'eliminar') {
      eliminarProveedorConfirm(id);
    }
  }

  // ==============================
  // Buscar (filtro local)
  // ==============================
  window.buscarProveedores = function () {
    const input = document.getElementById('buscar');
    if (!input) return;
    const texto = input.value.toLowerCase();
    document.querySelectorAll('#tablaProveedores tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(texto) ? '' : 'none';
    });
  };

  // ==============================
  // Abrir modal para nuevo proveedor
  // ==============================
  function abrirModalNuevo() {
    const form = document.getElementById('formProveedor');
    if (form) form.reset();
    const idInput = document.getElementById('id_proveedores');
    if (idInput) idInput.value = '';
    const titulo = document.getElementById('modalProveedorLabel');
    if (titulo) titulo.textContent = 'Registrar Proveedor';
    if (modalProveedorInstance) modalProveedorInstance.show();
  }

  // ==============================
  // Editar proveedor - carga datos al modal
  // ==============================
  async function editarProveedor(id) {
    try {
      const res = await fetch(`${API_PROVEEDORES}/buscar/${id}`);
      const data = await safeJson(res);
      const p = data.resultado;
      if (!p) return alert('Proveedor no encontrado');

      // asignar campos (tolerante a nombres de campos)
      const idField = document.getElementById('id_proveedores');
      if (idField) idField.value = p.id_proveedor ?? p.id_proveedores ?? p.id ?? '';

      const setIf = (selId, val) => {
        const el = document.getElementById(selId);
        if (el) el.value = val ?? '';
      };

      setIf('nombre', p.nombre);
      setIf('nit', p.nit);
      setIf('telefono', p.telefono);
      setIf('correo', p.correo);
      setIf('direccion', p.direccion);

      const titulo = document.getElementById('modalProveedorLabel');
      if (titulo) titulo.textContent = 'Editar Proveedor';

      if (modalProveedorInstance) modalProveedorInstance.show();
    } catch (err) {
      console.error('❌ Error al cargar proveedor:', err);
      alert('Error al cargar proveedor. Revisa la consola.');
    }
  }

  // ==============================
  // Guardar proveedor (crear o actualizar)
  // ==============================
  async function guardarProveedor(e) {
    e.preventDefault();
    try {
      const id = document.getElementById('id_proveedores')?.value;
      const proveedor = {
        nombre: document.getElementById('nombre')?.value || '',
        nit: document.getElementById('nit')?.value || '',
        telefono: document.getElementById('telefono')?.value || '',
        correo: document.getElementById('correo')?.value || '',
        direccion: document.getElementById('direccion')?.value || ''
      };

      const url = id ? `${API_PROVEEDORES}/actualizar/${id}` : `${API_PROVEEDORES}/registrar`;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
      });

      const data = await safeJson(res);
      alert(data.mensaje || (res.ok ? 'Operación completada' : 'Error en servidor'));

      if (res.ok) {
        if (modalProveedorInstance) modalProveedorInstance.hide();
        await listarProveedores();
      }
    } catch (err) {
      console.error('❌ Error al guardar proveedor:', err);
      alert('⚠️ Error al guardar el proveedor. Revisa la consola.');
    }
  }

  // ==============================
  // Confirmar y eliminar
  // ==============================
  function eliminarProveedorConfirm(id) {
    if (!confirm('¿Seguro que deseas eliminar este proveedor?')) return;
    eliminarProveedor(id);
  }

  async function eliminarProveedor(id) {
    try {
      const res = await fetch(`${API_PROVEEDORES}/eliminar/${id}`, { method: 'DELETE' });
      const data = await safeJson(res);
      alert(data.mensaje || (res.ok ? 'Proveedor eliminado' : 'Error al eliminar'));
      if (res.ok) listarProveedores();
    } catch (err) {
      console.error('❌ Error al eliminar proveedor:', err);
      alert('⚠️ Error al eliminar proveedor. Revisa la consola.');
    }
  }

  // ==============================
  // Inicialización: attach listeners con seguridad
  // ==============================
  document.addEventListener('DOMContentLoaded', () => {
    // btnNuevo - puede no existir en otras vistas
    const btnNuevo = document.getElementById('btnNuevo');
    if (btnNuevo) btnNuevo.addEventListener('click', abrirModalNuevo);

    // modal instance
    const modalEl = document.getElementById('modalProveedor');
    if (modalEl) modalProveedorInstance = new bootstrap.Modal(modalEl);

    // form submit
    const form = document.getElementById('formProveedor');
    if (form) {
      form.addEventListener('submit', guardarProveedor);
    }

    // listar inicialmente
    const tabla = document.getElementById('tablaProveedores');
    if (tabla) listarProveedores();
  });

  // Exponer función para debugging si se necesita
  window.__proveedores_debug = {
    listarProveedores,
    editarProveedor,
    eliminarProveedor
  };

})();
