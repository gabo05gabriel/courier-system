const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function apiFetch(path, { method = "GET", body, token, useCredentials } = {}) {
  const headers = {};
  if (!useCredentials) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    // Si tu backend usa cookie httpOnly para JWT/sesión:
    credentials: useCredentials ? "include" : "same-origin",
  });

  // Si hay respuesta vacía (204), devolvemos null
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || "Error de servidor";
    throw new Error(msg);
  }
  return data;
}
