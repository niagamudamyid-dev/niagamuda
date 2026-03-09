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

// ========================
// MONGODB CONNECTION CACHE
// ========================

const MONGO_URI = process.env.MONGO_URI;

if (!globalThis.mongoose) {
  globalThis.mongoose = { conn: null };
}

async function connectDB() {
  try {

    if (globalThis.mongoose.conn) {
      return globalThis.mongoose.conn;
    }

    globalThis.mongoose.conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return globalThis.mongoose.conn;

  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// ========================
// JWT VERIFY
// ========================

function verifyAdmin(req) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];

  try {

    jwt.verify(token, process.env.JWT_SECRET);
    return true;

  } catch {
    return false;
  }
}

// ========================
// HANDLER
// ========================

export default async function handler(req, res) {

  try {

    // ===== CORS FIX =====
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    await connectDB();

    const { id } = req.query;

    // ========================
    // GET BOOKS (PUBLIC)
    // ========================

    if (req.method === "GET") {

      const books = await Book.find().sort({ createdAt: -1 });

      return res.status(200).json(books);

    }

    // ========================
    // DELETE BOOK (PROTECTED)
    // ========================

    if (req.method === "DELETE") {

      if (!verifyAdmin(req)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.public_id) {
        await cloudinary.uploader.destroy(book.public_id);
      }

      await Book.findByIdAndDelete(id);

      return res.status(200).json({ message: "Deleted successfully" });

    }

    // ========================
    // UPDATE BOOK (PROTECTED)
    // ========================

    if (req.method === "PUT") {

      if (!verifyAdmin(req)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {

        try {

          const book = await Book.findById(id);

          if (!book) {
            return res.status(404).json({ message: "Book not found" });
          }

          const updateData = {
            title: fields.title[0],
            price: Number(fields.price[0]),
          };

          if (files.image) {

            if (book.public_id) {
              await cloudinary.uploader.destroy(book.public_id);
            }

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

    // ========================
    // CREATE BOOK (PROTECTED)
    // ========================

    if (req.method === "POST") {

      if (!verifyAdmin(req)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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

  } catch (error) {

    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      error: error.message
    });

  }

}