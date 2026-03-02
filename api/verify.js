/* eslint-env node */
/* global process */

import jwt from "jsonwebtoken";

export default function handler(req, res) {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ valid: false, message: "No header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ valid: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ valid: true, decoded });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return res.status(401).json({ valid: false, message: error.message });
  }
}