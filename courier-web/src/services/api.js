const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// función genérica para hacer requests a la API
async function request(path, { method = "GET", body, headers } = {}) {
  const token = localStorage.getItem("token"); // 🔑 si guardaste JWT en login

  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // añade token si existe
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`${BASE}${path}`, opts);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }

  return data;
}

export const api = {
  request, // 👈 disponible para otros módulos (usuarios, envíos, etc.)

  // login adaptado a tu backend que espera "contrasena"
  login: async (email, password) => {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: { email, contrasena: password },
    });

    // si el backend devuelve el token lo guardamos
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  // endpoint para validar sesión
  me: () => request("/api/auth/me"),

  // cerrar sesión
  logout: () => {
    localStorage.removeItem("token");
  },
};
