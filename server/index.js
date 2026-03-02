require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");
const upload = require("./upload");
const app = express();
const Book = require("./models/Book");
const cloudinary = require("./cloudinary");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =================================
// 🔐 JWT AUTH MIDDLEWARE
// =================================
function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

// =================================
// TEST ROUTE
// =================================
app.get("/", (req, res) => {
  res.send("API Toko Buku Jalan 🚀");
});

// =================================
// 🔐 ADMIN LOGIN (JWT)
// =================================
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  }

  res.status(401).json({ message: "Login gagal" });
});

// =================================
// GET ALL BOOKS (PUBLIC)
// =================================
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// =================================
// POST BOOK (PROTECTED)
// =================================
app.post("/books", jwtAuth, upload.single("image"), async (req, res) => {
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

// =================================
// DELETE BOOK (PROTECTED)
// =================================
app.delete("/books/:id", jwtAuth, async (req, res) => {
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

// =================================
// UPDATE BOOK (PROTECTED)
// =================================
app.put("/books/:id", jwtAuth, upload.single("image"), async (req, res) => {
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

// =================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});