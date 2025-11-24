// ✅ roles.js - Gestión de Roles
const API_ROLES = "http://localhost:3000/api/roles";

// ================================
// 🔹 Cargar lista de roles
// ================================
async function listarRoles() {
  try {
    const res = await fetch(`${API_ROLES}/listar`);
    const data = await res.json();

    if (!res.ok || !data.resultado) {
      alert("❌ No se pudieron cargar los roles.");
      return;
    }

    const tbody = document.querySelector("#tablaRoles tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.resultado.forEach((rol) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rol.id_roles}</td>
        <td>${rol.nombre}</td>
        <td>${rol.descripcion || "—"}</td>
        <td class="text-center">
          <button class="btn btn-warning btn-sm me-1" data-action="editar" data-id="${rol.id_roles}">✏️</button>
          <button class="btn btn-danger btn-sm" data-action="eliminar" data-id="${rol.id_roles}">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Delegación de eventos para botones
    tbody.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = btn.dataset.id;
        if (btn.dataset.action === "editar") editarRol(id);
        else if (btn.dataset.action === "eliminar") eliminarRol(id);
      });
    });

  } catch (error) {
    console.error("Error al listar roles:", error);
    alert("❌ Error al listar roles en el servidor.");
  }
}

// ================================
// 🔹 Registrar o actualizar rol
// ================================
async function registrarRol(e) {
  e.preventDefault();

  const id_roles = document.getElementById("id_roles").value;
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  const datos = { nombre, descripcion };
  const url = id_roles
    ? `${API_ROLES}/actualizar/${id_roles}`
    : `${API_ROLES}/registrar`;
  const metodo = id_roles ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || "Error al guardar el rol");

    alert(data.mensaje || "✅ Rol guardado correctamente");
    document.getElementById("formRol").reset();
    bootstrap.Modal.getInstance(document.getElementById("modalRol")).hide();
    listarRoles();
  } catch (error) {
    console.error("Error al guardar rol:", error);
    alert("❌ " + error.message);
  }
}

// ================================
// 🔹 Editar rol
// ================================
async function editarRol(id) {
  try {
    const res = await fetch(`${API_ROLES}/buscar/${id}`);
    const data = await res.json();

    if (!res.ok || !data.resultado) {
      alert("❌ No se pudo obtener el rol.");
      return;
    }

    const rol = data.resultado;
    document.getElementById("id_roles").value = rol.id_roles;
    document.getElementById("nombre").value = rol.nombre;
    document.getElementById("descripcion").value = rol.descripcion || "";

    document.getElementById("modalRolLabel").textContent = "Editar Rol";
    const modal = new bootstrap.Modal(document.getElementById("modalRol"));
    modal.show();
  } catch (error) {
    console.error("Error al obtener rol:", error);
    alert("❌ Error al obtener los datos del rol.");
  }
}

// ================================
// 🔹 Eliminar rol
// ================================
async function eliminarRol(id) {
  if (!confirm("¿Seguro que deseas eliminar este rol?")) return;

  try {
    const res = await fetch(`${API_ROLES}/eliminar/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.mensaje || "No se pudo eliminar el rol");

    alert(data.mensaje || "✅ Rol eliminado correctamente");
    listarRoles();
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    alert("❌ " + error.message);
  }
}

// ================================
// 🔹 Buscar rol por nombre
// ================================
function buscarRoles() {
  const filtro = document.getElementById("buscar").value.toLowerCase();
  const filas = document.querySelectorAll("#tablaRoles tbody tr");

  filas.forEach((fila) => {
    const nombre = fila.children[1].textContent.toLowerCase();
    fila.style.display = nombre.includes(filtro) ? "" : "none";
  });
}

// ================================
// 🔹 Inicialización
// ================================
document.addEventListener("DOMContentLoaded", () => {
  listarRoles();

  const form = document.getElementById("formRol");
  if (form) {
    form.addEventListener("submit", registrarRol);
  }
});
