/* eslint-env node */
/* global process */

import jwt from "jsonwebtoken";

export default function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ valid: true, decoded });

  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res.status(401).json({ valid: false });
  }
}