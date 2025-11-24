// =========================================
// 🚀 NAVBAR GLOBAL CON DATOS DE CONFIGURACIÓN
// =========================================

(function () {

  const API_CONFIG = "http://localhost:3000/api/configuracion/obtener";

  async function obtenerConfiguracion() {
    try {
      const res = await fetch(API_CONFIG);
      const data = await res.json();
      return data?.resultado || null;
    } catch (err) {
      console.error("Error obteniendo configuración:", err);
      return null;
    }
  }

  function createNavbarHtml(nombre = "Sistema Tienda", logo = "") {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div class="container-fluid">

        <a class="navbar-brand fw-bold d-flex align-items-center" id="homeLink">
          
          ${logo ? `<img src="${logo}" alt="logo" style="width:32px;height:32px;border-radius:6px;object-fit:cover;margin-right:8px;">` : ""}
          
          ${nombre}
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="menuNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="menuOpciones">
            <li class="nav-item admin registrador"><a class="nav-link" href="clientes.html">Clientes</a></li>
            <li class="nav-item admin registrador"><a class="nav-link" href="productos.html">Productos</a></li>
            <li class="nav-item admin"><a class="nav-link" href="categorias.html">Categorías</a></li>
            <li class="nav-item admin registrador"><a class="nav-link" href="proveedores.html">Proveedores</a></li>
            <li class="nav-item admin registrador"><a class="nav-link" href="ventas.html">Ventas</a></li>
            <li class="nav-item admin"><a class="nav-link" href="detallesVentas.html">Detalles Ventas</a></li>
            <li class="nav-item admin"><a class="nav-link" href="usuarios.html">Usuarios</a></li>
            <li class="nav-item admin"><a class="nav-link" href="roles.html">Roles</a></li>
            <li class="nav-item admin"><a class="nav-link" href="configuracion.html">Configuración</a></li>
          </ul>

          <div class="d-flex align-items-center text-white">
            <span id="usuarioActivo" class="me-3 fw-semibold"></span>
            <button class="btn btn-outline-light btn-sm" id="btnCerrarSesion">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>
    `;
  }

  function showUserAndFilter() {
    const stored = localStorage.getItem("usuarioActivo");
    if (!stored) return;

    const user = JSON.parse(stored);
    const span = document.getElementById("usuarioActivo");
    const home = document.getElementById("homeLink");

    span.textContent = `${user.nombre} (${user.rol})`;

    if (user.rol === "Administrador") {
      document.querySelectorAll(".registrador").forEach(el => el.style.display = "");
      document.querySelectorAll(".admin").forEach(el => el.style.display = "");
      home.href = "dashboard_admin.html";
    }

    if (user.rol === "Registrador") {
      document.querySelectorAll(".admin").forEach(el => el.style.display = "none");
      document.querySelectorAll(".registrador").forEach(el => el.style.display = "");
      home.href = "dashboard_registrador.html";
    }
  }

  function attachLogout() {
    const btn = document.getElementById("btnCerrarSesion");

    if (btn) {
      btn.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "login.html";
      });
    }
  }

  async function injectNavbar() {
    const container = document.getElementById("navbar-dinamico");
    if (!container) return;

    // 🟢 Obtener configuración del sistema (logo + nombre)
    const config = await obtenerConfiguracion();

    container.innerHTML = createNavbarHtml(
      config?.nombre_tienda || "Sistema Tienda",
      config?.logo_url || ""
    );

    showUserAndFilter();
    attachLogout();
  }

  document.addEventListener("DOMContentLoaded", injectNavbar);

})();
