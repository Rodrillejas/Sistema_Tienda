// =========================
// GESTIÓN DE USUARIOS
// =========================
const API_USUARIOS = "http://localhost:3000/api/usuarios";
const API_ROLES = "http://localhost:3000/api/roles/listar";

const tablaBody = document.querySelector("#tablaUsuarios tbody");
const formUsuario = document.getElementById("formUsuario");
const modalUsuario = new bootstrap.Modal(document.getElementById("modalUsuario"));
const selectRol = document.getElementById("rol_id");
const inputBuscar = document.getElementById("buscar");

// =========================
// 🔹 Safe JSON
// =========================
async function safeJson(res) {
  const txt = await res.text();
  try { return JSON.parse(txt); }
  catch { console.error("Respuesta no válida:", txt); return {}; }
}

// =========================
// 🔹 Listar usuarios
// =========================
async function listarUsuarios() {
  try {
    const res = await fetch(`${API_USUARIOS}/listar`);
    const data = await safeJson(res);
    const usuarios = data.resultado || data || [];

    tablaBody.innerHTML = "";

    usuarios.forEach((u) => {
      const rol = u.Rol?.nombre || u.rol?.nombre || u.nombre_rol || "Sin rol";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id_usuarios}</td>
        <td>${u.username || "—"}</td>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>${rol}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editarUsuario(${u.id_usuarios})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.id_usuarios})">🗑️</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    alert("❌ Error al obtener usuarios del servidor.");
  }
}

// =========================
// 🔹 Cargar roles
// =========================
async function cargarRoles() {
  try {
    const res = await fetch(API_ROLES);
    const data = await safeJson(res);
    const roles = data.resultado || data || [];

    selectRol.innerHTML = `<option value="">Seleccione un rol...</option>`;
    roles.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id_roles;
      opt.textContent = r.nombre;
      selectRol.appendChild(opt);
    });
  } catch (error) {
    console.error("Error al cargar roles:", error);
  }
}

// =========================
// 🔹 Guardar / Actualizar
// =========================
formUsuario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id_usuarios").value;
  const payload = {
    username: document.getElementById("username").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    password: document.getElementById("password").value.trim(),
    id_roles: parseInt(selectRol.value),
  };

  if (!payload.username || !payload.nombre || !payload.correo || !payload.id_roles) {
    alert("⚠️ Complete todos los campos obligatorios.");
    return;
  }

  const url = id ? `${API_USUARIOS}/actualizar/${id}` : `${API_USUARIOS}/registrar`;
  const metodo = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await safeJson(res);

    alert(data.mensaje || "✅ Usuario guardado correctamente.");
    formUsuario.reset();
    modalUsuario.hide();
    listarUsuarios();
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    alert("❌ Error al guardar usuario.");
  }
});

// =========================
// 🔹 Editar usuario
// =========================
async function editarUsuario(id) {
  try {
    const res = await fetch(`${API_USUARIOS}/buscar/${id}`);
    const data = await safeJson(res);
    const u = data.resultado || data;

    if (!u) {
      alert("Usuario no encontrado.");
      return;
    }

    await cargarRoles();

    document.getElementById("id_usuarios").value = u.id_usuarios;
    document.getElementById("username").value = u.username || "";
    document.getElementById("nombre").value = u.nombre || "";
    document.getElementById("correo").value = u.correo || "";
    document.getElementById("password").value = "";

    selectRol.value =
      u.id_roles ||
      (u.Rol && u.Rol.id_roles) ||
      (u.rol && u.rol.id_roles) ||
      "";

    modalUsuario.show();
  } catch (error) {
    console.error("Error al editar usuario:", error);
    alert("❌ Error al cargar usuario.");
  }
}
window.editarUsuario = editarUsuario;

// =========================
// 🔹 Eliminar usuario
// =========================
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  try {
    const res = await fetch(`${API_USUARIOS}/eliminar/${id}`, { method: "DELETE" });
    const data = await safeJson(res);
    alert(data.mensaje || "🗑️ Usuario eliminado correctamente.");
    listarUsuarios();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
}
window.eliminarUsuario = eliminarUsuario;

// =========================
// 🔹 Buscar usuario
// =========================
function buscarUsuarios() {
  const filtro = inputBuscar.value.toLowerCase();
  document.querySelectorAll("#tablaUsuarios tbody tr").forEach((fila) => {
    fila.style.display = fila.textContent.toLowerCase().includes(filtro) ? "" : "none";
  });
}

// =========================
// 🔹 Inicializar
// =========================
document.addEventListener("DOMContentLoaded", () => {
  listarUsuarios();
  cargarRoles();
  inputBuscar.addEventListener("input", buscarUsuarios);
});
