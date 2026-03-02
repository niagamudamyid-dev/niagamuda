/* eslint-env node */
/* global process */

import mongoose from "mongoose";
import { IncomingForm } from "formidable";
import cloudinary from "./cloudinary.js";
import Book from "./models/Book.js";
import "./db.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MONGO_URI = process.env.MONGO_URI;

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(MONGO_URI);
  return cached.conn;
}

export default async function handler(req, res) {

  // ✅ HANDLE CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  const { id } = req.query;

  // =====================
  // GET
  // =====================
  if (req.method === "GET") {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(books);
  }

  // =====================
  // DELETE
  // =====================
  if (req.method === "DELETE") {
    await Book.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }

  // =====================
  // UPDATE
  // =====================
  if (req.method === "PUT") {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      try {
        const updateData = {
          title: fields.title[0],
          price: Number(fields.price[0]),
        };

        if (files.image) {
          const file = files.image[0];

          const result = await cloudinary.uploader.upload(
            file.filepath,
            { folder: "books" }
          );

          updateData.image = result.secure_url;
          updateData.public_id = result.public_id;
        }

        const updated = await Book.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        );

        return res.status(200).json(updated);

      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Update failed" });
      }
    });

    return;
  }

  // =====================
  // CREATE (POST)
  // =====================
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      try {
        let imageUrl = null;
        let publicId = null;

        if (files.image) {
          const file = files.image[0];

          const result = await cloudinary.uploader.upload(
            file.filepath,
            { folder: "books" }
          );

          imageUrl = result.secure_url;
          publicId = result.public_id;
        }

        const book = await Book.create({
          title: fields.title[0],
          price: Number(fields.price[0]),
          image: imageUrl,
          public_id: publicId,
        });

        return res.status(200).json(book);

      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Upload failed" });
      }
    });

    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}