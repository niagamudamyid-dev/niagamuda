require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");
const upload = require("./upload");
const path = require("path");
const app = express();
const Book = require("./models/Book");

const cloudinary = require("./cloudinary");
// middleware
app.use(cors());

// IMPORTANT:
// jangan parsing multipart request
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


// DATA SEMENTARA (nanti database)
let books = [
  { id: 1, title: "React Modern", price: 59000 },
  { id: 2, title: "NodeJS Pemula", price: 75000 },
];

// test route
app.get("/", (req, res) => {
  res.send("API Toko Buku Jalan 🚀");
});

// GET semua buku
app.get("/books", async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});

// POST buku
app.post("/books", upload.single("image"), async (req, res) => {
  try {

    const book = new Book({
      title: req.body.title,
      price: Number(req.body.price),
      image: req.file?.path || null,
      imagePublicId: req.file?.filename || null,
    });

    await book.save();

    res.json(book);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE buku
app.delete("/books/:id", async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ⭐ hapus image cloudinary
    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted + Image Removed" });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Edit buku
app.put("/books/:id", upload.single("image"), async (req, res) => {

  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const updateData = {
    title: req.body.title,
    price: Number(req.body.price),
  };

  // jika upload gambar baru
  if (req.file) {

    // ⭐ hapus gambar lama
    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    updateData.image = req.file.path;
    updateData.imagePublicId = req.file.filename;
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updatedBook);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
