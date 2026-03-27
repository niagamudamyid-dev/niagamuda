/* eslint-env node */
/* global process */

import jwt from "jsonwebtoken";

// 🔥 SIMPLE MEMORY RATE LIMIT (tanpa library)
const loginAttempts = {};

export default async function handler(req, res) {

  // ❌ HAPUS LOG SENSITIF (WAJIB)
  console.log("METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || "unknown";

  // 🔥 RATE LIMIT (5x percobaan / 5 menit)
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, time: Date.now() };
  }

  const attempt = loginAttempts[ip];

  if (Date.now() - attempt.time > 5 * 60 * 1000) {
    attempt.count = 0;
    attempt.time = Date.now();
  }

  if (attempt.count >= 5) {
    return res.status(429).json({
      message: "Terlalu banyak percobaan login. Coba lagi nanti."
    });
  }

  const { username, password } = req.body || {};

  // 🔥 NORMALISASI INPUT
  const cleanUser = username?.trim();
  const cleanPass = password?.trim();

  if (
    cleanUser === process.env.ADMIN_USER &&
    cleanPass === process.env.ADMIN_PASS
  ) {

    // reset attempt jika sukses
    loginAttempts[ip] = { count: 0, time: Date.now() };

    const token = jwt.sign(
      {
        role: "admin",
        loginAt: Date.now()
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({ token });
  }

  // tambah count gagal
  attempt.count++;

  // 🔥 DELAY ANTI BRUTE FORCE
  await new Promise(resolve => setTimeout(resolve, 1000));

  return res.status(401).json({ message: "Login gagal" });
}