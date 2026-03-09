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

// =================
// MONGODB CONNECT
// =================

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

// =================
// VERIFY ADMIN
// =================

function verifyAdmin(req) {

  const auth = req.headers.authorization;

  if (!auth) {
    throw new Error("Unauthorized");
  }

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET);

}

// =================
// HANDLER
// =================

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    await connectDB();

    const { id } = req.query;

    // =================
    // GET BOOKS
    // =================

    if (req.method === "GET") {

      const books = await Book.find({}).sort({ createdAt: -1 });

      return res.status(200).json(books);

    }

    // =================
    // DELETE
    // =================

    if (req.method === "DELETE") {

      verifyAdmin(req);

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

    // =================
    // CREATE BOOK
    // =================

    if (req.method === "POST") {

      verifyAdmin(req);

      const form = new IncomingForm();

      form.parse(req, async (err, fields, files) => {

        if (err) {
          return res.status(500).json({ error: "Form parse error" });
        }

        try {

          let image = null;
          let public_id = null;

          if (files.image) {

            const file = files.image[0];

            const upload = await cloudinary.uploader.upload(
              file.filepath,
              { folder: "books" }
            );

            image = upload.secure_url;
            public_id = upload.public_id;

          }

          const book = await Book.create({
            title: fields.title[0],
            price: Number(fields.price[0]),
            image,
            public_id,
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