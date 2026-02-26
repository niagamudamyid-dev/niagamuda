
import mongoose from "mongoose";
import Book from "./models/Book.js";

const MONGO_URI = process.env.MONGO_URI;
console.log("ENV CHECK:", process.env.MONGO_URI);

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

  if (req.method === "GET") {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(books);
  }

  return res.status(405).json({ message: "Method not allowed" });
}