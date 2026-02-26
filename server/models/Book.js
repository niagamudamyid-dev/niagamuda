const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  imagePublicId: String, // ⭐ TAMBAH INI
}, { timestamps: true });

module.exports = mongoose.model("Book", BookSchema);