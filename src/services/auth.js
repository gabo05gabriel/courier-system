import { apiFetch } from "../api/client";

// Ajusta estos paths a tu backend
const LOGIN_PATH = "/auth/login";
const ME_PATH    = "/auth/me";
const LOGOUT_PATH= "/auth/logout";

// --- Variante A: backend devuelve JWT en JSON (no-cookie) ---
export async function loginWithJsonToken({ email, password }) {
  const data = await apiFetch(LOGIN_PATH, { method: "POST", body: { email, password }});
  // Esperamos algo como { access_token: "..." } o { token: "..." }
  const token = data.access_token || data.token;
  if (!token) throw new Error("No se recibió el token");
  localStorage.setItem("token", token);
  return token;
}
export function getToken() { return localStorage.getItem("token"); }
export function logoutJsonToken() { localStorage.removeItem("token"); }

// --- Variante B: backend setea cookie httpOnly (recomendado) ---
export async function loginWithCookie({ email, password }) {
  // credentials: 'include' activado en apiFetch con useCredentials:true
  await apiFetch(LOGIN_PATH, { method: "POST", body: { email, password }, useCredentials: true });
  return true;
}
export async function getMe({ useCookie = false } = {}) {
  const token = !useCookie ? getToken() : undefined;
  return apiFetch(ME_PATH, { token, useCredentials: useCookie });
}
export async function logout({ useCookie = false } = {}) {
  if (useCookie) {
    await apiFetch(LOGOUT_PATH, { method: "POST", useCredentials: true });
  } else {
    logoutJsonToken();
  }
}
