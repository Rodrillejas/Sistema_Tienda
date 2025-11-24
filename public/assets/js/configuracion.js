// ================================
// CONFIGURACIÓN FRONTEND
// ================================
const API_BASE = "http://localhost:3000/api/configuracion";

// ================================
// Cargar configuración
// ================================
async function cargarConfiguracion() {
  try {
    const res = await fetch(`${API_BASE}/obtener`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.mensaje || "Error al obtener configuración.");
      return;
    }

    const c = data.resultado;

    document.getElementById("nombre_tienda").value = c.nombre_tienda || "";
    document.getElementById("logo_url").value = c.logo_url || "";
    document.getElementById("moneda").value = c.moneda || "COP";
    document.getElementById("impuestos_porcentaje").value = c.impuestos_porcentaje ?? 0;

  } catch (err) {
    console.error("Error cargando configuración:", err);
    alert("Error al conectar con el servidor.");
  }
}

// ================================
// Guardar configuración
// ================================
document.getElementById("formConfig").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    nombre_tienda: document.getElementById("nombre_tienda").value,
    logo_url: document.getElementById("logo_url").value,
    moneda: document.getElementById("moneda").value,
    impuestos_porcentaje: parseFloat(document.getElementById("impuestos_porcentaje").value) || 0
  };

  try {
    const res = await fetch(`${API_BASE}/actualizar/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.mensaje || "Configuración actualizada exitosamente.");
    } else {
      alert(data.mensaje || "Error al actualizar configuración.");
    }

  } catch (err) {
    console.error("Error guardando configuración:", err);
    alert("Error al conectar con el servidor.");
  }
});

// ================================
// Al cargar la página
// ================================
document.addEventListener("DOMContentLoaded", cargarConfiguracion);
