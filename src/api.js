const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const opts = { method, headers, credentials: "include" };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) {
    let msg = "Request failed";
    try { const data = await res.json(); msg = data.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function saveLocalCart(items) {
  localStorage.setItem("localCart", JSON.stringify(items || []));
}
export function loadLocalCart() {
  try { return JSON.parse(localStorage.getItem("localCart")||"[]"); } catch { return []; }
}
