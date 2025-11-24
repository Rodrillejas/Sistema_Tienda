// =========================
// assets/js/categoria.js
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:3000/api/categorias';

  const tabla = document.querySelector('#tablaCategorias tbody');
  const form = document.querySelector('#formCategoria');
  const btnNuevo = document.querySelector('#btnNuevo');
  const buscarInput = document.querySelector('#buscar');
  const tituloModal = document.querySelector('#tituloModal');
  const modalCategoria = new bootstrap.Modal(document.getElementById('modalCategoria'));

  let editando = false;

  // ✅ Manejar respuesta JSON segura
  async function leerJSON(res) {
    const texto = await res.text();
    try {
      return JSON.parse(texto);
    } catch {
      throw new Error('Respuesta no válida del servidor.');
    }
  }

  // ✅ Cargar todas las categorías
  async function cargarCategorias() {
    try {
      const res = await fetch(`${API_BASE}/listar`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await leerJSON(res);

      tabla.innerHTML = '';

      if (!data.resultado || data.resultado.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Sin categorías registradas</td></tr>`;
        return;
      }

      data.resultado.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${cat.id_categoria}</td>
          <td>${cat.nombre}</td>
          <td>${cat.descripcion || ''}</td>
          <td class="text-center">
            <button class="btn btn-warning btn-sm me-1" onclick="editarCategoria(${cat.id_categoria})">✏️</button>
            <button class="btn btn-danger btn-sm me-1" onclick="eliminarCategoria(${cat.id_categoria})">🗑️</button>
            <button class="btn btn-info btn-sm" onclick="verCategoria(${cat.id_categoria})">👁️</button>
          </td>
        `;
        tabla.appendChild(tr);
      });
    } catch (error) {
      alert('⚠️ No se pudieron cargar las categorías: ' + error.message);
    }
  }

  // ✅ Abrir modal nueva categoría
  btnNuevo.addEventListener('click', () => {
    form.reset();
    document.querySelector('#id_categoria').value = '';
    editando = false;
    tituloModal.textContent = 'Registrar Categoría';
    modalCategoria.show();
  });

  // ✅ Guardar o actualizar
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoria = {
      nombre: document.querySelector('#nombre').value.trim(),
      descripcion: document.querySelector('#descripcion').value.trim()
    };

    let url = `${API_BASE}/registrar`;
    let method = 'POST';

    if (editando) {
      const id = document.querySelector('#id_categoria').value;
      url = `${API_BASE}/actualizar/${id}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
      });

      const data = await leerJSON(res);
      alert(data.mensaje || 'Operación completada');
      modalCategoria.hide();
      await cargarCategorias();
    } catch (error) {
      alert('⚠️ Error al guardar la categoría: ' + error.message);
    }
  });

  // ✅ Editar categoría
  window.editarCategoria = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/buscar/${id}`);
      const data = await leerJSON(res);
      const cat = data.resultado;

      document.querySelector('#id_categoria').value = cat.id_categoria;
      document.querySelector('#nombre').value = cat.nombre;
      document.querySelector('#descripcion').value = cat.descripcion || '';

      editando = true;
      tituloModal.textContent = 'Editar Categoría';
      modalCategoria.show();
    } catch (error) {
      alert('⚠️ No se pudo cargar la categoría: ' + error.message);
    }
  };

  // ✅ Eliminar categoría
  window.eliminarCategoria = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    try {
      const res = await fetch(`${API_BASE}/eliminar/${id}`, { method: 'DELETE' });
      const data = await leerJSON(res);
      alert(data.mensaje || 'Categoría eliminada');
      await cargarCategorias();
    } catch (error) {
      alert('⚠️ Error al eliminar: ' + error.message);
    }
  };

  // ✅ Ver categoría
  window.verCategoria = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/buscar/${id}`);
      const data = await leerJSON(res);
      const c = data.resultado;
      alert(`📦 Categoría:\n\nNombre: ${c.nombre}\nDescripción: ${c.descripcion || 'N/A'}`);
    } catch (error) {
      alert('⚠️ Error al ver categoría: ' + error.message);
    }
  };

  // ✅ Búsqueda en tabla
  buscarInput.addEventListener('input', () => {
    const texto = buscarInput.value.toLowerCase();
    document.querySelectorAll('#tablaCategorias tbody tr').forEach(tr => {
      const nombre = tr.children[1].textContent.toLowerCase();
      const desc = tr.children[2].textContent.toLowerCase();
      tr.style.display = (nombre.includes(texto) || desc.includes(texto)) ? '' : 'none';
    });
  });

  // 🚀 Inicializar
  cargarCategorias();
});
