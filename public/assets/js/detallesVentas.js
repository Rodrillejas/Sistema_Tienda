// ===============================
// 📄 public/assets/js/detallesVentas.js
// ===============================

const API_BASE = "http://localhost:3000/api";
const API_VENTAS = `${API_BASE}/ventas`;
const API_DETALLES = `${API_BASE}/venta_detalle`;
const API_REPORTES = `${API_BASE}/reportes`;

// -------------------------------
// 💰 Utilidades
// -------------------------------
function formatMoney(n) {
  return Number(n).toLocaleString("es-CO", { style: "currency", currency: "COP" });
}

async function safeJson(res) {
  const t = await res.text();
  try { return JSON.parse(t); } catch { return {}; }
}

// -------------------------------
// ⏱ NORMALIZACIÓN DE FECHAS
// -------------------------------
const normalizarFechaInicio = f => f ? `${f} 00:00:00` : "";
const normalizarFechaFin = f => f ? `${f} 23:59:59` : "";

// -------------------------------
// 📋 Listar detalles de ventas
// -------------------------------
async function listarDetallesVentas(fechaInicio, fechaFin) {
  try {
    const fi = normalizarFechaInicio(fechaInicio);
    const ff = normalizarFechaFin(fechaFin);

    let url = `${API_DETALLES}/listar`;
    if (fechaInicio || fechaFin) url += `?fechaInicio=${fi}&fechaFin=${ff}`;

    let res = await fetch(url);

    if (!res.ok) {
      // fallback si backend no tiene tabla detalle
      res = await fetch(`${API_VENTAS}/listar`);
      const data = await safeJson(res);
      renderDetallesFromVentas(data.resultado || [], fi, ff);
      return;
    }

    const data = await safeJson(res);
    renderDetallesTabla(data.resultado || []);
  } catch (err) {
    console.error("❌ Error listarDetallesVentas:", err);
    alert("⚠️ Error al listar detalles de ventas.");
  }
}

// -------------------------------
// 🧾 Render tabla principal
// -------------------------------
function renderDetallesTabla(detalles) {
  const tbody = document.querySelector("#tablaDetallesVentas tbody");
  tbody.innerHTML = "";

  if (!detalles.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay registros de ventas</td></tr>`;
    return;
  }

  detalles.forEach((d) => {
    const idVenta = d.id_ventas ?? d.idVenta ?? d.id_venta ?? d.venta_id ?? "-";
    const fecha = new Date(d.created_at || d.fecha).toLocaleString();
    const producto = d.producto?.nombre ?? d.nombre_producto ?? "-";
    const cantidad = d.cantidad ?? 0;

    // 🔥 USAR SIEMPRE SUBTOTAL REAL DEL BACKEND (CON IVA)
    const subtotal = d.subtotal ?? 0;

    const precio = d.precio_unitario ?? d.precio ?? 0;
    const cliente = d.cliente?.nombre ?? "-";
    const usuario = d.usuario?.nombre ?? "-";

    tbody.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
          <td>${idVenta}</td>
          <td>${fecha}</td>
          <td>${producto}</td>
          <td>${cantidad}</td>
          <td>${formatMoney(precio)}</td>
          <td>${formatMoney(subtotal)}</td>
          <td>${cliente}</td>
          <td>${usuario}</td>
        </tr>
      `
    );
  });
}

// -------------------------------
// 🔄 Fallback: derivar detalles desde ventas
// -------------------------------
function renderDetallesFromVentas(ventas, fi, ff) {
  const filas = [];

  ventas.forEach((v) => {
    const fechaVenta = new Date(v.fecha_venta || v.fecha);
    const fVenta = fechaVenta.getTime();

    if (fi && fVenta < new Date(fi).getTime()) return;
    if (ff && fVenta > new Date(ff).getTime()) return;

    const cliente = v.cliente?.nombre ?? "-";
    const usuario = v.usuario?.nombre ?? "-";
    const detalles = v.detalles || [];

    detalles.forEach((it) => {

      const precio = it.precio_unitario ?? it.precio ?? 0;
      const cantidad = it.cantidad ?? 0;

      // ⚠ fallback: si backend no proporciona subtotal con IVA, calcularlo
      let subtotal;

      if (it.subtotal) {
        // ✔ usar subtotal real del backend si existe
        subtotal = it.subtotal;
      } else if (it.iva) {
        // ✔ si viene iva en detalle
        subtotal = (precio * cantidad) * (1 + it.iva / 100);
      } else if (v.iva_total) {
        // ✔ si el IVA viene por venta completa (caso común)
        const ivaFactor = 1 + (v.iva_total / v.subtotal_total || 0);
        subtotal = (precio * cantidad) * ivaFactor;
      } else {
        // ❌ último recurso
        subtotal = precio * cantidad;
      }

      filas.push({
        ventaId: v.id_ventas ?? v.id ?? "-",
        fecha: fechaVenta.toLocaleString(),
        producto: it.producto?.nombre ?? it.nombre_producto ?? "-",
        cantidad,
        precio,
        subtotal,
        cliente,
        usuario,
      });
    });
  });

  const tbody = document.querySelector("#tablaDetallesVentas tbody");
  tbody.innerHTML = "";

  if (!filas.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No hay detalles disponibles</td></tr>`;
    return;
  }

  filas.forEach(f => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
          <td>${f.ventaId}</td>
          <td>${f.fecha}</td>
          <td>${f.producto}</td>
          <td>${f.cantidad}</td>
          <td>${formatMoney(f.precio)}</td>
          <td>${formatMoney(f.subtotal)}</td>
          <td>${f.cliente}</td>
          <td>${f.usuario}</td>
        </tr>
      `
    );
  });
}

// -------------------------------
// 📈 Reportes
// -------------------------------
async function generarGanancias(fechaInicio, fechaFin) {
  try {
    const fi = normalizarFechaInicio(fechaInicio);
    const ff = normalizarFechaFin(fechaFin);

    const url = `${API_REPORTES}/gananciasPorFecha?fechaInicio=${fi}&fechaFin=${ff}`;
    const res = await fetch(url);
    const data = await safeJson(res);
    const rows = data.resultado || [];

    const cont = document.getElementById("contenedorGanancias");
    if (!rows.length) {
      cont.innerHTML = `<div class="alert alert-info">No hay ganancias en ese rango.</div>`;
      return;
    }

    let html = `<table class="table table-sm table-dark text-center">
      <thead>
        <tr><th>Fecha</th><th>Ganancia Neta</th><th>Total Ventas</th><th>Cant. Ventas</th></tr>
      </thead><tbody>`;

    rows.forEach(r => {
      html += `
        <tr>
          <td>${r.fecha}</td>
          <td>${formatMoney(r.ganancia_neta)}</td>
          <td>${formatMoney(r.total_ventas)}</td>
          <td>${r.cantidad_ventas}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    cont.innerHTML = html;

  } catch (err) {
    console.error("❌ Error generarGanancias:", err);
    alert("Error al generar el reporte de ganancias.");
  }
}

async function cargarTop(tipo = "mas") {
  try {
    const url = `${API_REPORTES}/${tipo === "mas" ? "top10MasVendidos" : "top10MenosVendidos"}`;
    const res = await fetch(url);
    const data = await safeJson(res);

    const rows = data.resultado || [];
    const cont = document.getElementById(tipo === "mas" ? "topMas" : "topMenos");

    if (!rows.length) {
      cont.innerHTML = `<div class="alert alert-info">No hay datos disponibles.</div>`;
      return;
    }

    let html = `<ol class="list-group list-group-numbered">`;
    rows.forEach(r => {
      html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${r.producto ?? r.nombre}
          <span class="badge bg-warning text-dark">${r.total_vendido}</span>
        </li>`;
    });

    html += `</ol>`;
    cont.innerHTML = html;

  } catch (err) {
    console.error("❌ Error cargarTop:", err);
    alert("Error al cargar top ventas.");
  }
}

// -------------------------------
// 🧠 Eventos
// -------------------------------
document.getElementById("btnRefrescar").addEventListener("click", () => {
  listarDetallesVentas(
    document.getElementById("fInicio").value,
    document.getElementById("fFin").value
  );
});

document.getElementById("btnFiltrar").addEventListener("click", () => {
  document.getElementById("btnRefrescar").click();
});

document.getElementById("btnVerReportes").addEventListener("click", () => {
  new bootstrap.Modal(document.getElementById("modalReportes")).show();
  cargarTop("mas");
  cargarTop("menos");
});

document.getElementById("btnGenerarGanancias")?.addEventListener("click", () => {
  generarGanancias(
    document.getElementById("rInicio").value,
    document.getElementById("rFin").value
  );
});

// -------------------------------
// 🚀 Inicialización
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  listarDetallesVentas();
});
