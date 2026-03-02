require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");
const upload = require("./upload");
const app = express();
const Book = require("./models/Book");
const cloudinary = require("./cloudinary");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =============================
// 🔐 SIMPLE ADMIN PROTECTION
// =============================
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];

  if (!key || key !== process.env.VITE_ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

// =============================
// TEST ROUTE
// =============================
app.get("/", (req, res) => {
  res.send("API Toko Buku Jalan 🚀");
});

// =============================
// GET ALL BOOKS (PUBLIC)
// =============================
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// =============================
// POST BOOK (ADMIN ONLY)
// =============================
app.post("/books", adminAuth, upload.single("image"), async (req, res) => {
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
    res.status(500).json({ message: "Failed to create book" });
  }
});

// =============================
// DELETE BOOK (ADMIN ONLY)
// =============================
app.delete("/books/:id", adminAuth, async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId);
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// =============================
// UPDATE BOOK (ADMIN ONLY)
// =============================
app.put("/books/:id", adminAuth, upload.single("image"), async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updateData = {
      title: req.body.title,
      price: Number(req.body.price),
    };

    if (req.file) {

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

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});