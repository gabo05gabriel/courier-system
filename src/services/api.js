const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, { method = "GET", body, headers } = {}) {
  const token = localStorage.getItem("token");

  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
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
  // 👇 el backend espera "contrasena"
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: { email, contrasena: password },
    }),
  me: () => request("/api/auth/me"),
};
