// ==============================
// 🌐 Navbar Dinámica Global
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("navbar-dinamico");
  if (!navbarContainer) return;

  navbarContainer.innerHTML = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="dashboard.html">🛒 Sistema Tienda</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="clientes.html">Clientes</a></li>
          <li class="nav-item"><a class="nav-link" href="productos.html">Productos</a></li>
          <li class="nav-item"><a class="nav-link" href="categorias.html">Categorías</a></li>
          <li class="nav-item"><a class="nav-link" href="proveedores.html">Proveedores</a></li>
          <li class="nav-item"><a class="nav-link" href="ventas.html">Ventas</a></li>
          <li class="nav-item"><a class="nav-link" href="detallesVentas.html">Detalles Ventas</a></li>
          <li class="nav-item"><a class="nav-link" href="usuarios.html">Usuarios</a></li>
          <li class="nav-item"><a class="nav-link" href="roles.html">Roles</a></li>
          <li class="nav-item"><a class="nav-link" href="configuracion.html">Configuración</a></li>
        </ul>

        <div class="d-flex align-items-center text-white">
          <span id="usuarioActivo" class="me-3 fw-semibold"></span>
          <button class="btn btn-outline-light btn-sm" id="btnCerrarSesion">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </nav>
  `;

  // Marcar enlace activo
  const enlaces = document.querySelectorAll(".nav-link");
  enlaces.forEach(link => {
    if (window.location.pathname.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });

  // Usuario activo (si hay sesión guardada)
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (usuario) {
    const span = document.getElementById("usuarioActivo");
    span.textContent = `${usuario.nombre} (${usuario.rol || 'Sin rol'})`;
  }

  // Cerrar sesión
  const btnCerrar = document.getElementById("btnCerrarSesion");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "login.html";
    });
  }
});
