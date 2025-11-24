// ===============================
// ✅ LOGIN.JS - Sistema Tienda
// ===============================

const API_LOGIN = "http://localhost:3000/api/auth/login";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formLogin");
  const errorMensaje = document.getElementById("errorMensaje");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMensaje.style.display = "none";

    const usuarioInput = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuarioInput || !password) {
      mostrarError("⚠️ Ingresa usuario/correo y contraseña");
      return;
    }

    // Detectar si es correo o username
    const datos = usuarioInput.includes("@")
      ? { correo: usuarioInput, password }
      : { username: usuarioInput, password };

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarError(data.mensaje || "❌ Usuario o contraseña incorrectos.");
        return;
      }

      // ===============================
      // ✅ GUARDAR SESIÓN CORRECTA
      // ===============================
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));

      alert(`✅ Bienvenido ${data.usuario.nombre}`);

      // ===============================
      // ✅ REDIRECCIÓN SEGÚN ROL
      // ===============================
      const rol = data.usuario.rol;

      if (rol === "Administrador") {
        window.location.href = "dashboard_admin.html";
        return;
      }

      if (rol === "Registrador") {
        window.location.href = "dashboard_registrador.html";
        return;
      }

      // Rol desconocido
      mostrarError("⚠️ Tu rol no tiene acceso asignado.");

    } catch (error) {
      console.error("Error en login:", error);
      mostrarError("❌ Error de conexión con el servidor.");
    }
  });

  function mostrarError(msg) {
    errorMensaje.textContent = msg;
    errorMensaje.style.display = "block";
  }
});
