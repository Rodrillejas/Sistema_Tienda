// ===============================
// ✅ Protección de acceso a páginas
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "login.html";
  }
});
