const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export async function login(email, password) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function resetPassword() {
  const res = await fetch(`${BASE}/reset`, { method: "POST" });
  return res.json();
}

export async function verifyHorse(chosen, winner) {
  const res = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chosen, winner }),
  });
  return res.json();
}

export async function twoFactor(die1, die2) {
  const res = await fetch(`${BASE}/2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ die1, die2 }),
  });
  return res.json();
}
