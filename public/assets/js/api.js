// public/js/api.js
const API = {
  base: '/api',

  async get(endpoint) {
    try {
      const res = await fetch(`${this.base}${endpoint}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al obtener datos');
      return data.resultado || data;
    } catch (err) {
      console.error('GET error:', err);
      alert('⚠️ ' + err.message);
      return [];
    }
  },

  async post(endpoint, body) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al registrar');
      return data;
    } catch (err) {
      console.error('POST error:', err);
      alert('⚠️ ' + err.message);
    }
  },

  async put(endpoint, body) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al actualizar');
      return data;
    } catch (err) {
      console.error('PUT error:', err);
      alert('⚠️ ' + err.message);
    }
  },

  async delete(endpoint) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al eliminar');
      return data;
    } catch (err) {
      console.error('DELETE error:', err);
      alert('⚠️ ' + err.message);
    }
  }
};
