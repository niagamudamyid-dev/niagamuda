import mongoose from "mongoose";
import Book from "../server/models/Book.js";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(books);
  }

  res.status(405).json({ message: "Method not allowed" });
}