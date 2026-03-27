/* eslint-env node */
/* global process */

import mongoose from "mongoose";
import { IncomingForm } from "formidable";
import jwt from "jsonwebtoken";
import cloudinary from "./cloudinary.js";
import Book from "./models/Book.js";

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

  cached.conn = await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
  });

  return cached.conn;
}

// ✅ FIXED VERIFY ADMIN (AMAN + ROLE CHECK)
function verifyAdmin(req) {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return { error: "Unauthorized", status: 401 };
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 WAJIB: cek role admin
    if (decoded.role !== "admin") {
      return { error: "Forbidden", status: 403 };
    }

    return { user: decoded };

  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return { error: "Invalid token", status: 401 };
  }
}

export default async function handler(req, res) {

  // ✅ BATASI CORS (JANGAN *)
  res.setHeader("Access-Control-Allow-Origin", "https://niagamuda-one.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await connectDB();

    const { id, category, subcategory } = req.query;

    // ================= GET =================
    if (req.method === "GET") {

      if (id) {
        const book = await Book.findById(id);
        return res.json(book);
      }

      let filter = {};

      if (category) filter.category = category;
      if (subcategory) filter.subcategory = subcategory;

      const books = await Book.find(filter).sort({ createdAt: -1 });

      return res.status(200).json(books);
    }

    // ================= DELETE =================
    if (req.method === "DELETE") {

      const auth = verifyAdmin(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.public_id) {
        await cloudinary.uploader.destroy(book.public_id);
      }

      await Book.findByIdAndDelete(id);

      return res.status(200).json({ message: "Deleted" });
    }

    // ================= PUT =================
    if (req.method === "PUT") {

      const auth = verifyAdmin(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {

        try {

          const book = await Book.findById(id);

          if (!book) {
            return res.status(404).json({ message: "Book not found" });
          }

          // ✅ VALIDASI SEDERHANA
          const price = Number(fields.price?.[0]);
          if (fields.price && (isNaN(price) || price < 0)) {
            return res.status(400).json({ message: "Invalid price" });
          }

          let image = book.image;
          let public_id = book.public_id;

          if (files.image && files.image[0]) {

            if (book.public_id) {
              await cloudinary.uploader.destroy(book.public_id);
            }

            const file = files.image[0];

            const upload = await cloudinary.uploader.upload(
              file.filepath,
              { folder: "books" }
            );

            image = upload.secure_url;
            public_id = upload.public_id;
          }

          const updated = await Book.findByIdAndUpdate(
            id,
            {
              title: fields.title?.[0] || book.title,
              price: fields.price ? price : book.price,
              category: fields.category?.[0] || book.category,
              subcategory: fields.subcategory?.[0] || book.subcategory,

              description: fields.description?.[0] || book.description,
              author: fields.author?.[0] || book.author,
              isbn: fields.isbn?.[0] || book.isbn,
              publisher: fields.publisher?.[0] || book.publisher,
              publishDate: fields.publishDate?.[0] || book.publishDate,
              pages: fields.pages?.[0] || book.pages,
              weight: fields.weight?.[0] || book.weight,
              coverType: fields.coverType?.[0] || book.coverType,
              dimension: fields.dimension?.[0] || book.dimension,
              bonus: fields.bonus?.[0] || book.bonus,
              language: fields.language?.[0] || book.language,
              stock: Number(fields.stock?.[0] || book.stock),
              shopeeLink: fields.shopeeLink?.[0] || book.shopeeLink,

              image,
              public_id
            },
            { new: true }
          );

          return res.json(updated);

        } catch (error) {
          console.error("UPDATE ERROR:", error);
          return res.status(500).json({ error: error.message });
        }

      });

      return;
    }

    // ================= POST =================
    if (req.method === "POST") {

      const auth = verifyAdmin(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {

        try {

          const price = Number(fields.price?.[0]);
          if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: "Invalid price" });
          }

          let image = null;
          let public_id = null;

          if (files.image && files.image[0]) {

            const file = files.image[0];

            const upload = await cloudinary.uploader.upload(
              file.filepath,
              { folder: "books" }
            );

            image = upload.secure_url;
            public_id = upload.public_id;
          }

          const book = await Book.create({
            title: fields.title?.[0] || "",
            price,
            category: fields.category?.[0] || "",
            subcategory: fields.subcategory?.[0] || "",

            description: fields.description?.[0] || "",
            author: fields.author?.[0] || "",
            isbn: fields.isbn?.[0] || "",
            publisher: fields.publisher?.[0] || "",
            publishDate: fields.publishDate?.[0] || "",
            pages: fields.pages?.[0] || "",
            weight: fields.weight?.[0] || "",
            coverType: fields.coverType?.[0] || "",
            dimension: fields.dimension?.[0] || "",
            bonus: fields.bonus?.[0] || "",
            language: fields.language?.[0] || "",
            stock: Number(fields.stock?.[0] || 0),
            shopeeLink: fields.shopeeLink?.[0] || "",

            image,
            public_id
          });

          return res.status(200).json(book);

        } catch (error) {
          console.error("POST ERROR:", error);
          return res.status(500).json({
            error: error.message
          });
        }

      });

      return;
    }

    res.status(405).json({ message: "Method not allowed" });

  } catch (error) {

    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: error.message
    });

  }
}