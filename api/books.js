/* eslint-env node */
/* global process */

import mongoose from "mongoose";
import { IncomingForm } from "formidable";
import cloudinary from "../server/cloudinary.js";
import Book from "./models/Book.js";

export const config = {
  api: {
    bodyParser: false, // WAJIB untuk upload file
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
  await connectDB();

  // =====================
  // GET BOOKS
  // =====================
  if (req.method === "GET") {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(books);
  }

  // =====================
  // POST BOOK (UPLOAD)
  // =====================
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      try {
        const file = files.image[0];

        // upload ke cloudinary
        const result = await cloudinary.uploader.upload(
          file.filepath,
          { folder: "books" }
        );

        const book = await Book.create({
          title: fields.title[0],
          price: fields.price[0],
          image: result.secure_url,
          public_id: result.public_id,
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