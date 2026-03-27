/* eslint-env node */
/* global process */

import mongoose from "mongoose";
import Book from "./models/Book.js";

const MONGO_URI = process.env.MONGO_URI;

let cached = globalThis.mongoose || { conn: null };
globalThis.mongoose = cached;

async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
  });

  return cached.conn;
}

export default async function handler(req, res) {
  try {

    await connectDB();

    const books = await Book.find({}, "slug updatedAt");

    const baseUrl = "https://niagamuda-one.vercel.app";

    let urls = `
<url>
  <loc>${baseUrl}</loc>
</url>
<url>
  <loc>${baseUrl}/tentang</loc>
</url>`;

    books.forEach(book => {
      if (!book.slug) return;

      urls += `
<url>
  <loc>${baseUrl}/book/${book.slug}</loc>
  <lastmod>${book.updatedAt.toISOString()}</lastmod>
</url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    // 🔥 FIX UTAMA
    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(xml);

  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    res.status(500).send("Error sitemap");
  }
}