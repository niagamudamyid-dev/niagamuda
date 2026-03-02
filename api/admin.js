/* eslint-env node */
/* global process */

import jwt from "jsonwebtoken";

export default function handler(req, res) {

  console.log("METHOD:", req.method);
  console.log("BODY:", req.body);
  console.log("ENV USER:", process.env.ADMIN_USER);
  console.log("ENV PASS:", process.env.ADMIN_PASS);
  console.log("ENV SECRET:", process.env.JWT_SECRET);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body || {};

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: "Login gagal" });
}