/* eslint-env node */
/* global process */

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Category from "./models/Category.js";

const MONGO_URI = process.env.MONGO_URI;

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null };
}

async function connectDB() {

  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGO_URI, {
    bufferCommands: false
  });

  return cached.conn;
}

/* ======================
   VERIFY ADMIN
====================== */

function verifyAdmin(req) {

  const auth = req.headers.authorization;

  if (!auth) {
    throw new Error("Unauthorized");
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET);

}

/* ======================
   HANDLER
====================== */

export default async function handler(req, res) {

  await connectDB();

  const { id } = req.query;

  try {

    /* ======================
       GET ALL CATEGORY
    ====================== */

    if (req.method === "GET") {

      const categories = await Category.find({})
        .sort({ createdAt: -1 });

      return res.json(categories);

    }

    /* ======================
       CREATE CATEGORY
    ====================== */

    if (req.method === "POST") {

      verifyAdmin(req);

      const { name, parent } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name required" });
      }

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      /* CEK DUPLIKAT */

      const exists = await Category.findOne({ slug });

      if (exists) {
        return res.status(400).json({
          message: "Category already exists"
        });
      }

      const category = await Category.create({
        name,
        slug,
        parent: parent || null
      });

      return res.json(category);

    }

    /* ======================
       DELETE CATEGORY
    ====================== */

    if (req.method === "DELETE") {

      verifyAdmin(req);

      if (!id) {
        return res.status(400).json({ message: "ID required" });
      }

      await Category.findByIdAndDelete(id);

      return res.json({
        message: "Category deleted"
      });

    }

  } catch (err) {

    return res.status(500).json({
      message: err.message
    });

  }

}
